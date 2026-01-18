interface Props {
  children: React.ReactNode;
  userLevel: "beginner" | "advanced";
}

export default function AdaptiveUI({ children, userLevel }: Props) {
  return <div className={`p-6 rounded-xl ${userLevel === "beginner" ? "beginner-ui" : "advanced-ui"}`}>{children}</div>;
}
