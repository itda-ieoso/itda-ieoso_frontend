import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true, // 뷰박스를 설정해주어 아이콘으로 사용 가능하게 설정
      },
    }),
  ],
  optimizeDeps: {
    include: ["react-icons"], // react-icons를 최적화 대상에 추가
  },
});
