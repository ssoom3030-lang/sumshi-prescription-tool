<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/92125296-4d39-4e8c-a777-8b62982daa7d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## GitHub Pages 배포

1. GitHub 저장소 Settings > Pages
2. Source를 **GitHub Actions**로 변경
3. main 브랜치에 푸시하면 자동 배포

배포 주소 예시: `https://ssoom3030-lang.github.io/sumshi-prescription-tool/`
