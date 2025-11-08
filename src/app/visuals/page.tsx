import Visuals from "@/components/modules/visuals"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Visuals - EveryDollar",
    description: "Analyze your spending patterns and track your expenses",
}

const VisualsPage = () => {
    return (
        <>
            <Visuals />
        </>
    )
}

export default VisualsPage;