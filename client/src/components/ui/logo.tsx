// TODO: design an actual logo!

const Logo = ({ fill }: { fill?: string }) => (
  <svg
    width="20"
    viewBox="0 0 88 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Logo</title>
    <circle cx="44" cy="50" r="15" fill={fill ?? "black"} />
  </svg>
);

export default Logo;
