import Link from "next/link"
export default function Card({route, click, bg, img, title}) {
  return (
    <Link href={route} onClick={() => { click }}>
                                <div className={"d-flex "+bg}>
                                    <img src={img} alt="" />
                                    <h3>{title}</h3>
                                </div>
                            </Link>
  )
}
