import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') || 'Hello!';
  const bg = searchParams.get('bg') || 'lavender';
  
  try {
    // Load all font files
    const fontFiles = [
      { name: 'SpaceGrotesk-Bold', weight: 700, style: 'normal', path: 'SpaceGrotesk/SpaceGrotesk-Bold.ttf' },
      { name: 'SpaceGrotesk-Light', weight: 300, style: 'normal', path: 'SpaceGrotesk/SpaceGrotesk-Light.ttf' },
      { name: 'SpaceGrotesk-Medium', weight: 500, style: 'normal', path: 'SpaceGrotesk/SpaceGrotesk-Medium.ttf' },
      { name: 'SpaceGrotesk-Regular', weight: 400, style: 'normal', path: 'SpaceGrotesk/SpaceGrotesk-Regular.ttf' },
      { name: 'SpaceGrotesk-SemiBold', weight: 600, style: 'normal', path: 'SpaceGrotesk/SpaceGrotesk-SemiBold.ttf' },
    ];
    // Fetch all fonts concurrently
    const fontDataPromises = fontFiles.map(async (font) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEB_URL}/fonts/${font.path}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch font ${font.path}: ${response.statusText}`);
      }
      return {
        ...font,
        data: await response.arrayBuffer(),
      };
    });

    const fonts = await Promise.all(fontDataPromises);

    return new ImageResponse(
      (
        <div
          style={{
            width: '800px',
            height: '640px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            background: bg,
            position: 'relative',
            fontFamily: '"SpaceGrotesk-Bold"',
          }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_WEB_URL}/assets/SharePnL/share-pnl-bg.jpg`}
            alt="BG"
            width={800}
            height={640}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          />
          <div tw='relative w-full h-full flex flex-col pt-[63px] items-center'>
            {/* Logo */}
            <div tw='flex items-center mb-5'>
              <img
                src={`${process.env.NEXT_PUBLIC_WEB_URL}/assets/SharePnL/nexa-logo.png`}
                alt="Logo"
                width={48}
                height={48}
                tw='mr-[14.73px]'
              />
              <img
                src={`${process.env.NEXT_PUBLIC_WEB_URL}/assets/SharePnL/nexa-text.png`}
                alt="Logo Text"
                width={72.13}
                height={19.67}
              />
            </div>
            {/* Main Stat */}
            <div tw='flex flex-col items-center mb-8'>
              <p tw='text-[41.67px] leading-[100%]'>{title}</p>
              <div tw='flex items-center bg-[#1F73FC] rounded-[4.17px] gap-[8.33px] px-[16.67px] my-4'>
                <img
                  src={`${process.env.NEXT_PUBLIC_WEB_URL}/assets/SharePnL/solWhiteBg.png`}
                  alt="Solana"
                  width={20}
                  height={16}
                />
                <p
                  tw='text-[20.83px] leading-[20.83px]'
                  style={{
                    fontFamily: '"SpaceGrotesk-Medium"'
                  }}
                >
                  +0.011</p>
              </div>
              <div tw='w-[31.25px] h-[3.13px] bg-[#FFFFFF]' />
            </div>
            {/* Sub Stats */}
            <div tw='flex w-full mb-5 h-fit justify-center'>
              <div 
                tw='flex flex-col w-full h-fit max-w-[314px] text-[24px] leading-[100%] -top-5'
                style={{
                  fontFamily: '"SpaceGrotesk-Regular"'
                }}
              >
                <div tw='flex w-full h-[31px] text-[24px] justify-between mb-[10px]'>
                  <p>PnL</p>
                  <p
                    style={{
                    fontFamily: '"SpaceGrotesk-Bold"'
                  }}
                  >
                    210%
                  </p>
                </div>
                <div tw='flex w-full h-[31px] text-[24px] justify-between leading-[20.83px] mb-[10px]'>
                  <p>Invested</p>
                  <p
                    style={{
                    fontFamily: '"SpaceGrotesk-Medium"'
                  }}
                  >
                    +0.011
                  </p>
                </div>
                <div tw='flex w-full h-[31px] text-[24px] justify-between leading-[20.83px]'>
                  <p>Position</p>
                  <p
                    style={{
                    fontFamily: '"SpaceGrotesk-Medium"'
                  }}
                  >
                    +0.011
                  </p>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div tw='flex flex-col items-center'>
              <p
                tw='text-[26px] leading-[100%]'
                style={{
                  fontFamily: '"SpaceGrotesk-Medium"'
                }}
              >
                Crushing every trade 🚀
              </p>
              <div tw='flex bg-[#1F73FC] rounded-[6px] px-6 items-center'>
                <div tw='flex border-[3px] border-[#FFFFFF] rounded-full w-3 h-3 mr-3'/>
                <p 
                  tw='text-[16px] leading-[100%] flex'
                  style={{
                    fontFamily: '"SpaceGrotesk-Regular"'
                  }}
                >
                  With AI Signal Powered By 
                  <span
                    tw='ml-[4px]'
                    style={{
                    fontFamily: '"SpaceGrotesk-Bold"'
                  }}
                  >
                    Nexa
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 640,
        fonts: fonts.map((font) => ({
          name: font.name,
          data: font.data,
          weight: font.weight,
          style: font.style,
        })),
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}