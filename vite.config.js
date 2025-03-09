import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import svgrPlugin from 'vite-plugin-svgr'

// Vite 설정
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    svgrPlugin({
      // 옵션 설정 (필수는 아님)
      svgrOptions: {
        icon: true, // 뷰박스를 설정해주어 아이콘으로 사용 가능하게 설정
      },
    }),
  ],
  optimizeDeps: {
    include: ['react-icons'], // react-icons를 최적화 대상에 추가
  },
  build: {
    sourcemap: false, // Source Map 비활성화
  },
})