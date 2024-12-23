export default function manifest() {
    return {
      name: '433tips',
      short_name: '433tips',
      description: 'Get expert sports betting predictions and tips on football, soccer, basketball, and more at 433Tips. Join us for winning insights and tips to boost your betting game.',
      start_url: '/' || '/page/football',
      display: 'standalone',
      background_color: '#0a0e1a',
      theme_color: '#0a0e1a',
      icons: [
        {
          src: '/favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }