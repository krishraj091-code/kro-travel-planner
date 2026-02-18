import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Download, Film, Sparkles, Music, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TripPhoto {
  id: string;
  storage_path: string;
  place_name: string | null;
}

interface ReelGeneratorProps {
  tripId: string;
  destination: string;
  onClose: () => void;
}

const REQUIRED_PHOTOS = 10;

// Cinematic font & color themes
const TEMPLATES = [
  {
    id: "cinematic",
    name: "🎬 Cinematic",
    gradient: ["#0f2027", "#203a43", "#2c5364"],
    accentColor: "#00e5a0",
    textColor: "#e8f5f0",
    overlayOpacity: 0.62,
  },
  {
    id: "golden",
    name: "✨ Golden Hour",
    gradient: ["#7b4f12", "#c88b2a", "#f7d070"],
    accentColor: "#fff",
    textColor: "#2d1a00",
    overlayOpacity: 0.55,
  },
  {
    id: "ocean",
    name: "🌊 Ocean",
    gradient: ["#0052d4", "#4364f7", "#6fb1fc"],
    accentColor: "#a8f0ff",
    textColor: "#fff",
    overlayOpacity: 0.58,
  },
];

// All transitions mixed automatically
const TRANSITIONS_CONFIG = ["fade", "slide-left", "slide-up", "zoom-in", "blur", "flip", "rotate-fade"] as const;
type Transition = typeof TRANSITIONS_CONFIG[number];

const FRAME_DURATION = 3; // seconds per frame in canvas render
const FPS = 24;
const FRAME_TOTAL_FRAMES = FRAME_DURATION * FPS;

// ─── Canvas-based reel renderer ────────────────────────────────────────────
function drawTextShadowed(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, font: string, color: string, shadowColor = "rgba(0,0,0,0.7)") {
  ctx.font = font;
  ctx.fillStyle = shadowColor;
  ctx.fillText(text, x + 1, y + 1, maxW);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y, maxW);
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ─── Main Component ────────────────────────────────────────────────────────
const ReelGenerator = ({ tripId, destination, onClose }: ReelGeneratorProps) => {
  const [step, setStep] = useState<"upload" | "generating" | "done">("upload");
  const [existingPhotos, setExistingPhotos] = useState<TripPhoto[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; preview: string; src?: string }[]>([]);
  const [selectedExisting, setSelectedExisting] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [genProgress, setGenProgress] = useState(0);
  const [genLabel, setGenLabel] = useState("Initializing...");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchExisting();
  }, []);

  const fetchExisting = async () => {
    const { data } = await supabase.from("trip_photos")
      .select("id,storage_path,place_name").eq("trip_id", tripId).order("created_at", { ascending: false });
    setExistingPhotos(data || []);
    setLoading(false);
  };

  const getPublicUrl = (path: string) =>
    supabase.storage.from("trip-photos").getPublicUrl(path).data.publicUrl;

  // Total photos selected: uploaded + selected existing
  const allSelectedImages: { src: string; caption: string }[] = [
    ...uploadedFiles.map(f => ({ src: f.preview, caption: destination })),
    ...existingPhotos
      .filter(p => selectedExisting.includes(p.id))
      .map(p => ({ src: getPublicUrl(p.storage_path), caption: p.place_name || destination })),
  ];

  const totalCount = allSelectedImages.length;
  const canGenerate = totalCount === REQUIRED_PHOTOS;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = REQUIRED_PHOTOS - totalCount;
    Array.from(files).slice(0, remaining).forEach(f => {
      const preview = URL.createObjectURL(f);
      setUploadedFiles(prev => [...prev, { file: f, preview }]);
    });
  };

  const toggleExisting = (id: string) => {
    if (selectedExisting.includes(id)) {
      setSelectedExisting(prev => prev.filter(x => x !== id));
    } else if (totalCount < REQUIRED_PHOTOS) {
      setSelectedExisting(prev => [...prev, id]);
    }
  };

  const removeUploaded = (i: number) => {
    setUploadedFiles(prev => prev.filter((_, j) => j !== i));
  };

  // ── Canvas video generation ─────────────────────────────────────────────
  const generateVideo = useCallback(async () => {
    if (!canGenerate) return;
    setStep("generating");
    setGenProgress(0);
    setError(null);

    const W = 540, H = 960; // 9:16 portrait
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Load all images
    setGenLabel("Loading your photos...");
    let loadedImgs: HTMLImageElement[] = [];
    for (let i = 0; i < allSelectedImages.length; i++) {
      try {
        const img = await loadImage(allSelectedImages[i].src);
        loadedImgs.push(img);
      } catch {
        // fallback: blank
        const offC = document.createElement("canvas");
        offC.width = W; offC.height = H;
        const oCtx = offC.getContext("2d")!;
        oCtx.fillStyle = "#1a1a2e";
        oCtx.fillRect(0, 0, W, H);
        const fallbackImg = new Image();
        fallbackImg.src = offC.toDataURL();
        await new Promise(r => setTimeout(r, 50));
        loadedImgs.push(fallbackImg);
      }
      setGenProgress(Math.round((i / allSelectedImages.length) * 20));
    }

    setGenLabel("Setting up video encoder...");
    await new Promise(r => setTimeout(r, 100));

    // Check MediaRecorder support
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "video/webm";

    const stream = canvas.captureStream(FPS);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_000_000 });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

    let resolveRecording: () => void;
    const recordingDone = new Promise<void>(r => { resolveRecording = r; });
    recorder.onstop = () => resolveRecording();

    recorder.start(100);

    setGenLabel("Rendering frames with transitions...");

    // Randomly assign transitions to each frame
    const frameTransitions: Transition[] = loadedImgs.map((_, i) =>
      TRANSITIONS_CONFIG[i % TRANSITIONS_CONFIG.length]
    );

    // Draw gradient helper
    const drawGradientBg = (colors: string[]) => {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    };

    // Draw one image with Ken Burns
    const drawFrame = (img: HTMLImageElement, kenT: number) => {
      const scale = 1 + kenT * 0.06;
      const srcAspect = img.width / img.height;
      const dstAspect = W / H;
      let sw, sh, sx, sy;
      if (srcAspect > dstAspect) {
        sh = img.height; sw = sh * dstAspect; sx = (img.width - sw) / 2; sy = 0;
      } else {
        sw = img.width; sh = sw / dstAspect; sx = 0; sy = (img.height - sh) / 2;
      }
      const dw = W * scale, dh = H * scale;
      const dx = (W - dw) / 2, dy = (H - dh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    };

    // Draw overlay gradient
    const drawOverlay = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `rgba(0,0,0,${template.overlayOpacity * 0.4})`);
      grad.addColorStop(0.4, "rgba(0,0,0,0.0)");
      grad.addColorStop(1, `rgba(0,0,0,${template.overlayOpacity})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Template color tint
      const tGrad = ctx.createLinearGradient(0, 0, W, H);
      tGrad.addColorStop(0, template.gradient[0] + "55");
      tGrad.addColorStop(1, template.gradient[template.gradient.length - 1] + "33");
      ctx.fillStyle = tGrad;
      ctx.fillRect(0, 0, W, H);
    };

    // Draw text UI
    const drawUI = (idx: number, caption: string, progress: number) => {
      // Top badge
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      roundRect(ctx, 16, 20, 220, 36, 18);
      ctx.fill();
      drawTextShadowed(ctx, `📍 ${destination}`, 32, 43, 200, "bold 14px system-ui", template.accentColor);

      // Frame counter
      const counterText = `${idx + 1}/${loadedImgs.length}`;
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      roundRect(ctx, W - 70, 20, 54, 28, 14);
      ctx.fill();
      ctx.font = "11px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.textAlign = "right";
      ctx.fillText(counterText, W - 22, 38);
      ctx.textAlign = "left";

      // Bottom caption
      if (caption) {
        drawTextShadowed(ctx, caption, 20, H - 80, W - 40, "bold 18px system-ui", "#fff");
      }
      drawTextShadowed(ctx, "KroTravel", W - 90, H - 18, 80, "bold 10px system-ui", "rgba(255,255,255,0.3)");

      // Progress bar
      const barY = H - 28;
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(20, barY, W - 40, 3);
      ctx.fillStyle = template.accentColor;
      ctx.fillRect(20, barY, (W - 40) * progress, 3);
    };

    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    // Transition render for each pair (prev → cur)
    const renderTransitionFrame = (
      prev: HTMLImageElement | null,
      cur: HTMLImageElement,
      t: number, // 0..1 progress within transition
      transition: Transition,
      frameIdx: number,
      caption: string,
      kenT: number
    ) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (t < 0.3 && prev) {
        // Exit animation
        const exitT = easeOut(t / 0.3);
        switch (transition) {
          case "fade":
            drawGradientBg(template.gradient);
            ctx.globalAlpha = 1 - exitT;
            drawFrame(prev, 0);
            ctx.globalAlpha = 1;
            break;
          case "slide-left":
            drawGradientBg(template.gradient);
            ctx.save(); ctx.translate(-W * exitT, 0); drawFrame(prev, 0); ctx.restore();
            break;
          case "slide-up":
            drawGradientBg(template.gradient);
            ctx.save(); ctx.translate(0, -H * exitT); drawFrame(prev, 0); ctx.restore();
            break;
          case "zoom-in":
            drawGradientBg(template.gradient);
            ctx.save();
            ctx.translate(W / 2, H / 2);
            ctx.scale(1 + exitT * 0.3, 1 + exitT * 0.3);
            ctx.translate(-W / 2, -H / 2);
            ctx.globalAlpha = 1 - exitT;
            drawFrame(prev, 0);
            ctx.restore();
            ctx.globalAlpha = 1;
            break;
          case "blur":
          case "rotate-fade":
          case "flip":
            drawGradientBg(template.gradient);
            ctx.globalAlpha = 1 - exitT;
            drawFrame(prev, 0);
            ctx.globalAlpha = 1;
            break;
        }
      } else if (t < 0.65) {
        // Midpoint — black/gradient flash
        drawGradientBg(template.gradient);
      } else {
        // Enter animation
        const enterT = easeOut((t - 0.65) / 0.35);
        switch (transition) {
          case "fade":
            drawGradientBg(template.gradient);
            ctx.globalAlpha = enterT;
            drawFrame(cur, kenT);
            ctx.globalAlpha = 1;
            break;
          case "slide-left":
            drawGradientBg(template.gradient);
            ctx.save(); ctx.translate(W * (1 - enterT), 0); drawFrame(cur, kenT); ctx.restore();
            break;
          case "slide-up":
            drawGradientBg(template.gradient);
            ctx.save(); ctx.translate(0, H * (1 - enterT)); drawFrame(cur, kenT); ctx.restore();
            break;
          case "zoom-in":
            drawGradientBg(template.gradient);
            ctx.save();
            ctx.translate(W / 2, H / 2);
            const s = lerp(1.25, 1, enterT);
            ctx.scale(s, s);
            ctx.translate(-W / 2, -H / 2);
            ctx.globalAlpha = enterT;
            drawFrame(cur, kenT);
            ctx.restore();
            ctx.globalAlpha = 1;
            break;
          case "blur":
            drawGradientBg(template.gradient);
            ctx.globalAlpha = enterT;
            drawFrame(cur, kenT);
            ctx.globalAlpha = 1;
            break;
          case "rotate-fade":
            drawGradientBg(template.gradient);
            ctx.save();
            ctx.translate(W / 2, H / 2);
            ctx.rotate((1 - enterT) * 0.08);
            ctx.translate(-W / 2, -H / 2);
            ctx.globalAlpha = enterT;
            drawFrame(cur, kenT);
            ctx.restore();
            ctx.globalAlpha = 1;
            break;
          case "flip":
            drawGradientBg(template.gradient);
            ctx.globalAlpha = enterT;
            drawFrame(cur, kenT);
            ctx.globalAlpha = 1;
            break;
        }
      }

      drawOverlay();
      drawUI(frameIdx, caption, t);
    };

    const TRANSITION_FRAMES = 18; // frames for transition
    const STATIC_FRAMES = FRAME_TOTAL_FRAMES - TRANSITION_FRAMES; // steady frames

    let totalFramesDrawn = 0;
    const totalFrames = loadedImgs.length * FRAME_TOTAL_FRAMES;

    for (let imgIdx = 0; imgIdx < loadedImgs.length; imgIdx++) {
      const img = loadedImgs[imgIdx];
      const prevImg = imgIdx > 0 ? loadedImgs[imgIdx - 1] : null;
      const caption = allSelectedImages[imgIdx].caption;
      const transition = frameTransitions[imgIdx];

      // Transition frames (first TRANSITION_FRAMES)
      for (let f = 0; f < TRANSITION_FRAMES; f++) {
        const transT = f / TRANSITION_FRAMES;
        const kenT = 0;
        renderTransitionFrame(prevImg, img, transT, transition, imgIdx, caption, kenT);
        totalFramesDrawn++;
        setGenProgress(20 + Math.round((totalFramesDrawn / totalFrames) * 70));
        setGenLabel(`Rendering frame ${totalFramesDrawn}/${totalFrames}...`);
        await new Promise(r => setTimeout(r, 1000 / FPS));
      }

      // Static frames with Ken Burns
      for (let f = 0; f < STATIC_FRAMES; f++) {
        const kenT = f / STATIC_FRAMES;
        ctx.clearRect(0, 0, W, H);
        ctx.globalAlpha = 1;
        drawFrame(img, kenT);
        drawOverlay();
        drawUI(imgIdx, caption, 1);
        totalFramesDrawn++;
        setGenProgress(20 + Math.round((totalFramesDrawn / totalFrames) * 70));
        await new Promise(r => setTimeout(r, 1000 / FPS));
      }
    }

    setGenLabel("Finalizing video...");
    recorder.stop();
    await recordingDone;

    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);
    setGenProgress(100);
    setStep("done");
  }, [canGenerate, allSelectedImages, destination, template]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 24 }}
        transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "hsl(var(--background))", maxHeight: "92vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(270,60%,45%), hsl(300,55%,35%))" }}>
              <Film className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="font-heading text-sm" style={{ color: "hsl(158,45%,10%)" }}>30s Reel Generator</p>
              <p className="text-[10px] text-muted-foreground">High-quality video • Auto transitions • {destination}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── STEP: Upload ── */}
        {step === "upload" && (
          <div className="p-5 space-y-5">
            {/* Template picker */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Visual Style</p>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setTemplate(t)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all border ${template.id === t.id ? "border-primary shadow-md scale-105 ring-2 ring-primary/30" : "border-border/30"}`}
                    style={{
                      background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[t.gradient.length - 1]})`,
                      color: t.textColor,
                    }}>
                    {t.name}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">Transitions are auto-mixed for best effect</p>
            </div>

            {/* Photo count indicator */}
            <div className="flex items-center justify-between p-3 rounded-2xl"
              style={{
                background: canGenerate
                  ? "hsla(158,42%,38%,0.10)"
                  : totalCount > REQUIRED_PHOTOS
                  ? "hsla(0,72%,55%,0.08)"
                  : "hsla(40,85%,55%,0.08)",
                border: `1px solid ${canGenerate ? "hsla(158,42%,50%,0.25)" : "hsla(40,85%,55%,0.20)"}`,
              }}>
              <div className="flex items-center gap-2">
                {canGenerate
                  ? <CheckCircle2 className="w-4 h-4 text-primary" />
                  : <AlertCircle className="w-4 h-4" style={{ color: "hsl(40,85%,45%)" }} />
                }
                <span className="text-xs font-semibold" style={{ color: canGenerate ? "hsl(158,42%,30%)" : "hsl(40,85%,35%)" }}>
                  {totalCount}/{REQUIRED_PHOTOS} photos selected
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {canGenerate ? "Ready to generate!" : `Need exactly ${REQUIRED_PHOTOS} photos`}
              </span>
            </div>

            {/* Uploaded photos */}
            {uploadedFiles.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Uploaded ({uploadedFiles.length})</p>
                <div className="grid grid-cols-4 gap-2">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={f.preview} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeUploaded(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/65 flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload new */}
            {totalCount < REQUIRED_PHOTOS && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  Upload Photos ({REQUIRED_PHOTOS - totalCount} more needed)
                </p>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full py-5 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all flex flex-col items-center gap-2 text-muted-foreground hover:text-primary">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-medium">Tap to upload up to {REQUIRED_PHOTOS - totalCount} photos</span>
                  <span className="text-[10px] opacity-70">JPG, PNG, WEBP supported</span>
                </button>
              </div>
            )}

            {/* Existing trip photos */}
            {loading ? (
              <div className="text-center text-xs text-muted-foreground py-3">Loading trip photos…</div>
            ) : existingPhotos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  Your Trip Photos (tap to select)
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {existingPhotos.map(p => {
                    const isSelected = selectedExisting.includes(p.id);
                    const isDisabled = !isSelected && totalCount >= REQUIRED_PHOTOS;
                    return (
                      <button key={p.id} onClick={() => toggleExisting(p.id)}
                        disabled={isDisabled}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${isSelected ? "border-primary scale-95 shadow-md" : "border-transparent"} ${isDisabled ? "opacity-40" : ""}`}>
                        <img src={getPublicUrl(p.storage_path)} alt="" className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Generate button */}
            <div className="space-y-2">
              <button
                onClick={generateVideo}
                disabled={!canGenerate}
                className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Sparkles className="w-4 h-4" />
                Generate 30s Reel (HD Video)
              </button>
              {!canGenerate && (
                <p className="text-center text-[11px] text-muted-foreground">
                  Select exactly {REQUIRED_PHOTOS} photos to unlock generation
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl"
              style={{ background: "hsla(270,60%,45%,0.06)", border: "1px solid hsla(270,60%,45%,0.15)" }}>
              <Music className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "hsl(270,60%,45%)" }} />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Video generated directly in your browser — no upload needed. Ken Burns effects + auto-mixed transitions for every photo.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP: Generating ── */}
        {step === "generating" && (
          <div className="p-8 flex flex-col items-center gap-5">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-border/30" />
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(270,60%,45%), hsl(300,55%,35%))" }}>
                <Film className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-heading text-base mb-1" style={{ color: "hsl(158,45%,10%)" }}>
                Generating your reel…
              </p>
              <p className="text-xs text-muted-foreground mb-3">{genLabel}</p>
              <div className="w-64 h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, hsl(270,60%,45%), hsl(300,55%,35%))" }}
                  animate={{ width: `${genProgress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">{genProgress}% — this may take 1–2 minutes</p>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full text-center">
              {["Ken Burns Effect", "Auto Transitions", "HD 9:16"].map(label => (
                <div key={label} className="glass-panel py-2 px-2 rounded-xl">
                  <p className="text-[10px] font-semibold text-primary">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: Done ── */}
        {step === "done" && videoUrl && (
          <div className="p-5 space-y-4">
            <div className="text-center mb-2">
              <div className="text-4xl mb-2">🎬</div>
              <p className="font-heading text-lg" style={{ color: "hsl(158,45%,10%)" }}>Your Reel is Ready!</p>
              <p className="text-xs text-muted-foreground">Preview and download your video</p>
            </div>

            {/* Video preview */}
            <div className="rounded-2xl overflow-hidden bg-black mx-auto" style={{ maxHeight: "50vh", aspectRatio: "9/16", display: "flex" }}>
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain"
                style={{ maxHeight: "50vh" }}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setStep("upload"); setVideoUrl(null); setGenProgress(0); }}
                className="flex-1 py-3 rounded-xl btn-ghost-glass text-sm">
                ← Redo
              </button>
              <a
                href={videoUrl}
                download={`${destination.replace(/\s/g, "-")}-reel.webm`}
                className="flex-1 py-3 rounded-xl btn-primary text-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Reel
              </a>
            </div>
            <button onClick={onClose} className="w-full py-2 text-xs text-muted-foreground">Close</button>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-6 text-center">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="font-heading text-sm mb-1">Generation Failed</p>
            <p className="text-xs text-muted-foreground mb-4">{error}</p>
            <button onClick={() => { setError(null); setStep("upload"); }}
              className="btn-primary px-6 py-2 text-sm">Try Again</button>
          </div>
        )}

        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </motion.div>
  );
};

export default ReelGenerator;
