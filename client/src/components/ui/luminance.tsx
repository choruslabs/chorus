const getColorLuminance = (hexColor: string) => {
  let hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return l;
};

export const isWhiteTextPreferred = (hexColor: string) => {
  const luminance = getColorLuminance(hexColor);
  return luminance < 140;
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
    className={`${props.className ? props.className + " " : ""}
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
