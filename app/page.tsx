import { GraphScroller } from "@/components/GraphScroller";
import { BoxScroller } from "@/components";
import { InputValueProvider } from "@/data";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <InputValueProvider>
        <div className="h-screen w-screen flex flex-row">
          <BoxScroller />
          <div className="w-[calc(100vw-24.5rem)] h-full">
            <GraphScroller />
          </div>
        </div>
      </InputValueProvider>
    </main>
  );
}
