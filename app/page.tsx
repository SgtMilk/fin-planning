import { BoxScroller, GraphScroller } from "@/components";
import { InputValueProvider, OptionProvider } from "@/data";
import { OptionsPanel } from "@/components/OptionsPanel";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <InputValueProvider>
        <OptionProvider>
          <div className="h-screen w-screen flex flex-row">
            <BoxScroller />
            <div className="w-[calc(100vw-24.5rem)] h-full">
              <GraphScroller />
            </div>
            <OptionsPanel />
          </div>
        </OptionProvider>
      </InputValueProvider>
    </main>
  );
}
