import Image from "next/image";

const raw = [
  {
    image: "https://assets.guim.co.uk/images/guardian-logo-rss.c45beb1bafa34b347ac333af2e6fe23f.png",
    title:  "The Guardian"
  },
  {
    image: "https://www.aljazeera.com/images/logo_aje.png",
    title:  "Al Jazeera"
  },
  {
    image: "https://news.bbcimg.co.uk/nol/shared/img/bbc_news_120x60.gif",
    title:  "BBC"
  },
]

export default function Home() {
  return (
    <main className="container mx-auto flex h-auto items-center justify-between py-4 px-4">
       <div className="flex flex-1 justify-between items-start gap-4">
          {raw.map((item, index) => (
           <div key={index} className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl p-4">
           <div className="flex justify-between items-center">
             <div className="flex flex-1 flex-row justify-start items-center gap-4">
              <div className="w-14 h-14 relative ">
              <Image src={item.image} alt="Guardian" fill objectFit="contain" />
            </div>
            <div>
              <h3>{item.title}</h3>
            </div>
            </div>
            <div>
              <p className="text-sm">Updated at</p>
            </div>
           </div>
          </div>
          ))}

       </div>
       
    </main>
  );
}

