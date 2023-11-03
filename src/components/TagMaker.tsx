import InfoIcon from "@/icons/InfoIcon";
import Xmark from "@/icons/Xmark";

export default function TagMaker(props: {
  tagInputValue: string | undefined;
  tagHandler: (input: string) => void;
  tags: string[];
  deleteTag: (idx: number) => void;
}) {
  return (
    <div className="flex w-full flex-col justify-center md:flex-row md:justify-between">
      <div className="absolute -mt-12 mb-8 flex w-full justify-center md:mb-0 md:mt-0 md:w-full md:justify-normal">
        <div className="tooltip md:-ml-8">
          <div className="md:mt-12">
            <InfoIcon height={24} width={24} strokeWidth={1} />
          </div>
          <div className="tooltip-text -ml-20 w-40">
            <div className="px-1">start with # end with a space</div>
          </div>
        </div>
      </div>
      <div className="py-4 md:flex md:pt-0">
        <div className={`textarea-group`}>
          <input
            value={props.tagInputValue}
            onChange={(e) => props.tagHandler(e.target.value)}
            name="message"
            placeholder=" "
            className="underlinedInput w-full select-text bg-transparent"
          />
          <span className="bar" />
          <label className="underlinedInputLabel">Tags</label>
        </div>
      </div>
      <div className="my-auto flex max-w-[420px] flex-wrap justify-center italic md:justify-start">
        {props.tags.map((tag, idx) => (
          <div
            key={idx}
            className="group relative m-1 h-fit w-fit max-w-[120px] rounded-xl bg-purple-600 px-2 py-1 text-sm"
          >
            <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-white">
              {tag}
            </div>
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-50 opacity-0 group-hover:opacity-100"
              onClick={() => props.deleteTag(idx)}
            >
              <Xmark strokeWidth={1} color={"white"} height={24} width={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
