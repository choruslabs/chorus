const getRelativeLuminance = (hexColor: string): number => {
  let hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const rgb = [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

const getContrastRatio = (l1: number, l2: number): number => {
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

export const isWhiteTextPreferred = (backgroundHex: string): boolean => {
  const bgLuminance = getRelativeLuminance(backgroundHex);

  const whiteContrast = getContrastRatio(bgLuminance, 1); // white
  const blackContrast = getContrastRatio(bgLuminance, 0); // black

  return whiteContrast >= blackContrast;
};

export const ThemedButton = ({
  children,
  themeColor,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  themeColor?: string | null;
}) => (
  <button
    {...props}
    className={`${props.className ? `${props.className} ` : ""}
          ${
            !props.disabled
              ? themeColor
                ? isWhiteTextPreferred(themeColor)
                  ? "text-white"
                  : "text-black"
                : "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
    style={{
      backgroundColor: !props.disabled ? themeColor || undefined : undefined,
    }}
  >
    {children}
  </button>
);
