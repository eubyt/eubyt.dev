import { themeInitScript } from "@/lib/theme";

export function ThemeScript() {
  return (
    <script
      data-cfasync="false"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
