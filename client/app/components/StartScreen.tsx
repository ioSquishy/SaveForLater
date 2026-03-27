import { useState, useRef } from "react"

export interface StartScreenProps {
  onUpload: (files: File[]) => void
}

export default function StartScreen({ onUpload }: StartScreenProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supportedTypes = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"]

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files
    if (!files) return

    const newFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (supportedTypes.includes(file.type)) {
        newFiles.push(file)
      }
    }

    const nextPhotos = [...selectedPhotos, ...newFiles]

    setSelectedPhotos(nextPhotos)

    event.currentTarget.value = ""
  }
  return (
    <main className="relative min-h-screen overflow-hidden px-6 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-3rem] top-[-6rem] h-[34rem] w-[18rem] blur-[40px]"
        style={{
          background:
            "radial-gradient(circle at center, rgb(125 90 220 / 30%) 0%, rgb(125 90 220 / 0%) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-8rem] right-[-3rem] h-[34rem] w-[18rem] blur-[40px]"
        style={{
          background:
            "radial-gradient(circle at center, rgb(125 90 220 / 30%) 0%, rgb(125 90 220 / 0%) 70%)",
        }}
      />

      <section className="mx-auto flex w-full max-w-[24.375rem] flex-col">
        <div
          className="flex flex-col items-center px-6 pb-8 pt-10 text-center"
        >
          <header className="stagger-in px-1">
            <h1 className="leading-[0.9]" data-node-id="5:146">
              <span className="block text-[2.9rem] text-[var(--foreground)]">Song</span>
              <span className="block text-[2.9rem] text-[var(--primary)]">Extraction</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[22rem] text-[1.125rem] text-[rgb(202_195_216_/_80%)]">
              Select screenshots to begin extracting.
            </p>
          </header>

          <button
            type="button"
            onClick={handleUploadClick}
            className="stagger-in mt-12 w-full"
            style={{ animationDelay: "80ms" }}
          >
            <div
              className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden px-4 py-20"
              style={{
                borderRadius: "3rem",
                background: "rgb(27 27 32 / 40%)",
                border: "1px solid rgb(255 255 255 / 5%)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(255 255 255 / 10%) 0%, rgb(255 255 255 / 0%) 100%)",
                }}
              />

              <div
                className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full"
                style={{
                  background: "rgb(125 90 220 / 20%)",
                  border: "1px solid rgb(206 189 255 / 20%)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6.5C4 5.67157 4.67157 5 5.5 5H14.5C15.3284 5 16 5.67157 16 6.5V17.5C16 18.3284 15.3284 19 14.5 19H5.5C4.67157 19 4 18.3284 4 17.5V6.5Z"
                    fill="rgb(206 189 255 / 92%)"
                  />
                  <path
                    d="M8 14L10.2 11.6C10.4209 11.359 10.8036 11.3518 11.0333 11.5843L12.9 13.475L14.0759 12.3403C14.3087 12.1157 14.6775 12.1126 14.9141 12.3333L16 13.3464V17H8V14Z"
                    fill="rgb(57 0 148 / 86%)"
                  />
                  <circle cx="10" cy="9" r="1" fill="rgb(57 0 148 / 86%)" />
                  <path
                    d="M19 3V5H21V7H19V9H17V7H15V5H17V3H19Z"
                    fill="rgb(206 189 255 / 92%)"
                  />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col gap-2 text-center">
                <p className="font-[var(--font-display)] text-4xl font-bold leading-8 text-[var(--foreground)] sm:text-[2rem]">
                  Upload Screenshots
                </p>
                <p className="label text-[var(--primary)]">Tap to browse gallery</p>
              </div>

              <div
                aria-hidden="true"
                className="absolute bottom-[-2.6rem] right-[-2.6rem] h-40 w-40 rounded-full blur-[20px]"
                style={{ background: "rgb(206 189 255 / 10%)" }}
              />
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.jpeg,.jpg,.webp,.heic,.heif"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            aria-label="Upload photos"
          />

          <span className="meta-span mt-3" data-node-id="24:24">
            {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? "s" : ""} selected
          </span>

          <div className="stagger-in mt-11 w-full" style={{ animationDelay: "140ms" }}>
            <button type="button" className="primary-button">
              <span>Get Started</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3.3335 8H12.6668M12.6668 8L8.66683 4M12.6668 8L8.66683 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
