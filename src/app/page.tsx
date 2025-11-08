import Home from "@/components/modules/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - EveryDollar",
  description: "Manage your expenses and track your spending",
}


const HomePage = () => {
  return (
    <>
      <Home />
    </>
  )
}

export default HomePage;