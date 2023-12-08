import Image from 'next/image'
import submap from '../../../public/lwt-lossless.webp'
 
export default function Background(props) {
  return (
    <Image
      alt="Beijing Subway Map"
      src={submap}
      placeholder='blur'
      quality={100}
      fill
      sizes="7000px"
      style={{
        objectFit: 'cover',
      }}
      onLoad={props.callMaskToDisappear()}
      unoptimized
    />
  )
}