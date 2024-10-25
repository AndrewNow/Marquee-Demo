import Marquee from "./components/marquee";

const marqueeText = [{
  title: "Money by the Ton (Chapter 133) really long title here",
  artist: "DJ Screw"
}]

const title = marqueeText[0].title;
const artist = marqueeText[0].artist;

export default function Home() {
  return (
    <div className="bg-grey w-screen h-screen grid place-items-center">
      <div>
      <h1>Demo component below:</h1>     
        <div className="bg-white p-4 rounded-lg w-[500px]">
  
        <Marquee text={title} textClass="inline-block text-xl" parentClass="overflow-hidden w-[200px] sm:w-[300px]" />
        <Marquee text={artist} textClass="inline-block text-base text-grey-800" parentClass="overflow-hidden w-[200px] sm:w-[300px]" />
        </div>
      </div>
    </div>
  );
}
