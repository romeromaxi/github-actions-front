import { Font } from '@react-pdf/renderer';

interface FontRegistration {
  family: string;
  fonts: Array<{
    src: string;
    fontWeight: number | string;
  }>;
}

const PDFFontsHelper = {
  register: async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    try {
      const regularFont = await import('../../assets/fonts/Inter-Regular.ttf');
      
      const baseConfig: FontRegistration = {
        family: 'Inter',
        fonts: [
          { src: regularFont.default, fontWeight: 400 }
        ]
      };

      Font.register(baseConfig);

      window.addEventListener('load', async () => {
        const [
          thin, extraLight, light, medium, 
          semiBold, bold, extraBold, black
        ] = await Promise.all([
          import('../../assets/fonts/Inter-Thin.ttf'),
          import('../../assets/fonts/Inter-ExtraLight.ttf'),
          import('../../assets/fonts/Inter-Light.ttf'),
          import('../../assets/fonts/Inter-Medium.ttf'),
          import('../../assets/fonts/Inter-SemiBold.ttf'),
          import('../../assets/fonts/Inter-Bold.ttf'),
          import('../../assets/fonts/Inter-ExtraBold.ttf'),
          import('../../assets/fonts/Inter-Black.ttf')
        ]);

        Font.register({
          family: 'Inter',
          fonts: [
            { src: thin.default, fontWeight: 100 },
            { src: extraLight.default, fontWeight: 200 },
            { src: light.default, fontWeight: 300 },
            { src: medium.default, fontWeight: 500 },
            { src: semiBold.default, fontWeight: 600 },
            { src: semiBold.default, fontWeight: 'semibold' },
            { src: bold.default, fontWeight: 700 },
            { src: bold.default, fontWeight: 'bold' },
            { src: extraBold.default, fontWeight: 800 },
            { src: black.default, fontWeight: 900 }
          ]
        });
      });
    } catch (error) {
      console.error('Failed to load fonts:', error);
    }
  }
};

export { PDFFontsHelper };