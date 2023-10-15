import { BoxScroller } from "@/components";
import { InputValueProvider } from "@/data";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <InputValueProvider>
        <BoxScroller />
      </InputValueProvider>
    </main>
  );
}
