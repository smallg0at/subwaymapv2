import Image from 'next/image'
import submap from 'public/lwt-lossless.webp'
 
export default function Background() {
  return (
    <Image
      alt="Beijing Subway Map"
      src={submap}
      placeholder='blur'
      quality={90}
      fill
      sizes="100vw"
      style={{
        objectFit: 'cover',
      }}
    />
  )
}