import { useRouter } from "next/router";
import Breadcrumb from "../../../../components/Breadcrumb";
import { useEffect } from "react";

export default function BondDetails() {
    const router = useRouter()
    const { slug } = router.query
    const bondTable = async()=>{
        const fetchBondTable = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_V2}getBondDetailsByCusip?metadataName=Bondpricing_Master&cusipNo=00165AAH1&_=1725263719192`)
        const fetchBondTableRes = await fetchBondTable.json()
    }
    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">
                    <Breadcrumb />
                </div>
            </div>
        </>
    )
}