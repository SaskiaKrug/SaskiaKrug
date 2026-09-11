/* ============================================================
   PROJEKT-DATEN
   Hier neue Arbeiten hinzufügen oder bestehende anpassen.
   - folder: Ordnername unter assets/work/ (Unterordner mit "/" im Dateipfad möglich)
   - cover: Vorschaubild für die Kachel (Pfad relativ zu folder)
   - intro: Fließtext direkt unter dem Titel (optional)
   - topMedia: Bilder/Videos direkt unter dem Intro, ohne Zwischenüberschrift (optional)
   - sections: Unterkapitel mit eigener Überschrift, Text und Medien (optional)
   Medientyp wird automatisch aus der Dateiendung erkannt
   (mp4/mov = Video, mp3 = Audio, alles andere = Bild).
   ============================================================ */

function mediaType(file){
  const ext = file.split(".").pop().toLowerCase();
  if (["mp4","mov","webm"].includes(ext)) return "video";
  if (["mp3","wav","m4a"].includes(ext)) return "audio";
  return "image";
}

// Baut ein Medien-Objekt aus einem Dateinamen; caption optional überschreibbar.
function m(file, caption){
  return { type: mediaType(file), file, caption: caption || null };
}

// Zwischenüberschrift innerhalb einer Sektion (z. B. "Fotostrecke", "Social Media Verlängerung").
function h(text){
  return { type: "heading", file: null, caption: text };
}

// Fließtext innerhalb einer Sektion, z. B. direkt unter einer Zwischenüberschrift.
function t(text){
  return { type: "text", file: null, caption: text };
}

// Durchklickbare Slideshow aus mehreren Bildern (z. B. eine Fotostrecke), statt eines langen Rasters.
function slideshow(files, caption, protectedItem){
  return { type: "slideshow", files, caption: caption || null, protected: !!protectedItem };
}

// Karte, die zu einer eigenständigen Mini-App/Seite verlinkt (z. B. Kniffel unter Fun Projects).
// hoverColor (optional): "pink" | "green" | "white" | "grey" — Hover-Farbe der Kachel.
function appLink(url, title, hoverColor){
  return { type: "app-link", url, caption: title, hoverColor: hoverColor || null };
}

// Inaktive Karte für Inhalte, die noch folgen (kein Link, nur Ankündigung).
// hoverColor (optional): "pink" | "green" | "white" | "grey" — Hover-Farbe der Kachel.
function comingSoon(title, hoverColor){
  return { type: "coming-soon", caption: title, hoverColor: hoverColor || null };
}

const PROJECTS = [
  {
    client: "",
    title: "AI Projects",
    folder: "ai-projects",
    cover: "0000000m7AL000000000Ia-background.jpg",
    sections: [
      {
        heading: "BRITA x MBB",
        text: "Moodbilder, um die Schauspielerin und Unternehmerin Millie Bobby Brown davon zu überzeugen, das neue Gesicht von BRITA zu werden.",
        media: [
          slideshow(["IP-3.jpeg","IP-4.jpg","IP-5.jpg","IP-6.jpg","IP-7.jpg","IP-8.jpeg","IP-9.jpg","IP-10.jpg","IP-11.jpg","IP-12.jpg","IP-13.jpg","IP-14.jpg","IP-15.jpg"]
            .map(f => `BRITA x Millie Bobby Brown/0000000m7AL000000000${f}`))
        ]
      },
      {
        heading: "Konzerthaus Dortmund",
        text: "Poster bzw. Magazincover & Kampagnenmoods.",
        media: [
          slideshow(["J6-1.jpg","LI-3.gif","LI-4.jpeg","LI-5.jpeg","LI-6.jpeg","LI-7.jpeg"]
            .map(f => `Konzerthaus Dortmund/0000000m7AL000000000${f}`))
        ]
      },
      {
        heading: "Lorenz Crunchips",
        protected: true,
        text: "Stackers Launch Kampagne (vor der Abmahnung durch Pringles).",
        media: [
          slideshow(["LB-3.jpeg","LB-4.jpeg","LB-5.jpeg","LB-6.jpeg","LB-7.jpeg","LB-8.jpeg","LB-10.jpeg","LB-13.jpg"]
            .map(f => `Lorenz Crunchips/0000000m7AL000000000${f}`))
        ]
      },
      {
        heading: "BRITA Maxtra Basic",
        text: "Einführungskampagne des neuen Basic Jugs von BRITA.",
        media: [
          slideshow(["J7-5.jpg","J7-6.jpg","J7-7.jpg","J7-11.jpg","J7-12.jpg","JC-3.jpg","JC-4.jpg","JC-5.jpg","JC-6.jpg","JC-7.jpg","JC-8.jpg","Jj-3.jpg","Jj-4.jpg","Jj-5.jpg"]
            .map(f => `BRITA Maxtra Basic/0000000m7AL000000000${f}`))
        ]
      },
      {
        heading: "The Feather Collection",
        text: "Personal Project — Modestrecke der „Feather Collection“.",
        media: [
          slideshow(["IC-3.jpg","IC-4.jpg","IC-5.jpg","IC-6.jpg","IC-7.jpg","IC-8.jpg","IC-9.jpg","IC-10.jpg","IC-11.jpg","IC-12.jpg"]
            .map(f => `The Feather Collection/0000000m7AL000000000${f}`))
        ]
      }
    ]
  },
  {
    client: "",
    title: "heycar",
    folder: "heycar",
    cover: "cover-tile.jpeg",
    intro: "Die Volkswagentochter heycar bietet auf ihrer Online-Plattform hochwertige Gebrauchtwagen an. Im Vergleich zur Konkurrenz hat sie damit aber einen klaren Nachteil: den Preis. Wir verwandelten diesen Nachteil in einen Vorteil und sagten „Bye“ zu den typischen Pain Points beim Autokauf und „Hey“ zu den Key Benefits von heycar: Qualität, Verlässlichkeit und Peace of Mind.",
    topMedia: [
      m("HeyCar_BärenAufbinden_Frau.mp4", "15\" TVC „Bär“ — Frau"),
      m("HeyCar_BärenAufbinden_Mann.mp4", "15\" TVC „Bär“ — Mann"),
      m("HeyCar_BärenAufbinden_Mann2.mp4", "15\" TVC „Bär“ — Variante 2"),
      m("HeyCar_BärenAufbinden_Mann2B.mp4", "15\" TVC „Bär“ — Variante 2B"),
      m("HeyCar_LetztesHemd1.mp4", "„Das letzte Hemd“ — Variante 1"),
      m("HeyCar_LetztesHemd2.mp4", "„Das letzte Hemd“ — Variante 2"),
      m("HeyCar_Illu1.mp4", "Gespartwagen-Wochen — Animationsspot 1"),
      m("HeyCar_Illu2.mp4", "Gespartwagen-Wochen — Animationsspot 2"),
      m("0000000m7AL000000000ov-5.jpeg"), m("0000000m7AL000000000ov-6.jpeg"),
      m("0000000m7AL000000000ov-7.jpeg"), m("0000000m7AL000000000ov-8.jpeg"),
      m("0000000m7AL000000000ov-9.jpeg"), m("0000000m7AL000000000ov-10.jpeg")
    ]
  },
  {
    client: "Telekom",
    title: "Magenta TV",
    folder: "telekom-magenta-tv-1",
    cover: "MagentaTV_Hauptmotiv.jpeg",
    sections: [
      {
        heading: "Magenta TV Part I",
        text: "Magenta TV steht für beste Unterhaltung auf allen Kanälen. Das wollten wir nicht einfach nur behaupten, sondern beweisen — mit zwei Schauspielern, die keine Werbung machen, sondern tatsächlich unterhalten: Christian Ulmen und Fahri Yardim.",
        media: [
          m("MagentaTV_Part1_TVC_Hauptfilm.mp4", "Hauptfilm"),
          m("MagentaTV_Part1_TVC_Bett.mp4", "TVC „Bett“"),
          m("MagentaTV_Part1_TVC_Sofa.mp4", "TVC „Sofa“"),
          m("MagentaTV_Part1_TVC_Küche.mp4", "TVC „Küche“"),
          m("MagentaTV_Part1_TVC_Bushaltestelle.mp4", "TVC „Bushaltestelle“"),
          m("MagentaTV_Hauptmotiv.jpeg"), m("MagentaTV_Motive1.jpeg"), m("MagentaTV_Motive2.jpeg"),
          m("MagentaTV_Motive3.jpeg"), m("MagentaTV_Motive4.jpeg"), m("MagentaTV_Motive5.jpeg")
        ]
      },
      {
        heading: "Magenta TV Part II",
        text: "Dank unserer 360°-Kampagne waren Christian und Fahri plötzlich überall zu sehen und zu hören: im Fernsehen, auf Social Media, im Radio und sogar auf WhatsApp. Diesen Overload machten wir zum Thema der zweiten Magenta-TV-Kampagne.",
        media: [
          m("MagentaTV_Part 2_Bus.mp4", "„Bus“"),
          m("MagentaTV_Part 2_Pizza.mp4", "„Pizza“")
        ]
      },
      {
        heading: "Magenta TV Part III",
        text: "Magenta TV geht in die nächste Runde. Doch diesmal kommt mit Netflix ein neuer Player ins Spiel. Christian und Fahri brauchen also Verstärkung — auch wenn sie selbst ganz anderer Meinung sind.",
        media: [
          m("MagentaTV_Part 3_Interview.mp4", "Interview"),
          m("MagentaTV_Part 3_Set.mp4", "Set")
        ]
      },
      {
        heading: "Funkspots",
        text: "Drei Radiospots, die das Kampagnenthema akustisch weiterspinnen.",
        media: [
          m("MagentaTV_Radio1.mp3", "Funkspot „Radiowerbung“"),
          m("MagentaTV_Radio2.mp3", "Funkspot „Erotic Lounge“"),
          m("MagentaTV_Radio3.mp3", "Funkspot „Nicht im Radio“")
        ]
      },
      {
        heading: "WhatsApp Comedy",
        text: "Die erste WhatsApp Comedy.",
        media: [ m("MagentaTV_WhatsApp_Comedy.mp4") ]
      },
      {
        heading: "Christmas Special",
        text: "Das Weihnachts-Special der Magenta-TV-Kampagne.",
        media: [ m("MagentaTV_ChristmasTVC.mp4") ]
      }
    ]
  },
  {
    client: "Telekom",
    title: "5G",
    folder: "telekom-5g",
    cover: "cover-tile.jpeg",
    intro: "5G steht für Leistung, Effizienz und Geschwindigkeit. Wir wollten die neue Technologie auf eine Weise zeigen, wie es noch keiner getan hat: langsam, warm und emotional — als echte Chance, einander über alle Grenzen hinweg nah zu sein.",
    sections: [
      {
        heading: "5G Part II",
        media: [
          m("5G Part II/5G Kampagne_PartII.mp4", "Kampagnenfilm"),
          h("Fotostrecke"),
          slideshow(["01","02","03","04","05","06"].map(n => `5G Part II/Fotostrecke_ArminSmilovic_${n}.jpg`), "Armin Smailovic", true),
          slideshow(["01","02","03","04","05","06","07","08","09"].map(n => `5G Part II/Fotostrecke_JaninaLaszlo_${n}.jpeg`), "Janina Laszlo", true),
          slideshow(["01","02","03","04","05","06","07"].map(n => `5G Part II/Fotostrecke_MekiTsige_${n}.jpeg`), "Meki Tsige", true),
          h("Social Media Verlängerung"),
          m("5G Part II/SoMe_Assets1.jpeg"),
          m("5G Part II/SoMe_Assets2.png"),
          m("5G Part II/SoMe_Assets3.png"),
          m("5G Part II/SoMe_Assets4.png"),
          m("5G Part II/SoMe_Assets5.png")
        ]
      },
      {
        heading: "5G Part III — Telekom & Apple",
        text: "Das erste 5G-fähige iPhone und das beste 5G-Netz Deutschlands: Diese einzigartige Verbindung erzählten wir mit einer außergewöhnlichen Ost-West-Geschichte — von zwei Freundinnen, die alle Hindernisse der Zeit überwanden und die sich heute, dank 5G, so nah sein können wie niemals zuvor.",
        media: [
          m("5G Part III/5G Kampagne_PartIII_TVC.mp4", "60\" TVC"),
          m("5G Part III/5G Kampagne_PartIII_Doku.mp4", "Making Of"),
          m("5G Part III/5G Kampagne_PartIII_DC.mp4", "Director's Cut"),
          ...[1,2,3,4,5,6,7].map(n => m(`5G Part III/Reaction${n}.gif`, "Community-Reaktion"))
        ]
      }
    ]
  },
  {
    client: "Telekom",
    title: "Young",
    protected: true,
    folder: "telekom-young",
    cover: "Bildschirmfoto 2026-08-27 um 14.01.13.jpg",
    topMedia: [
      m("Young_TVC_20Sec.mp4", "Onlinefilm, 20″"),
      m("Young_TVC_30Sec.mp4", "Onlinefilm, 30″")
    ],
    sections: [
      {
        heading: "Print/SoMe",
        text: "Um die junge Zielgruppe der Young-Tarife zu erreichen, wurde der Look & Feel der Kampagne auf die 18+ Zielgruppe angepasst.",
        media: [
          m("Young_OOH1.jpeg"), m("Young_OOH2.jpeg"), m("Young_OOH3.jpeg"),
          m("Young_SoMe.jpeg"), m("Young_SoMe2.jpeg"),
          m("Bildschirmfoto 2026-08-27 um 14.01.13.jpg")
        ]
      }
    ]
  },
  {
    client: "HP",
    title: "Drucken ohne Drama",
    folder: "hp",
    cover: "0000000m7AL000000000pX-15.jpeg",
    intro: "Wer kennt es nicht: Immer, wenn man etwas Wichtiges ausdrucken muss, spinnt der Drucker. Um den Premium-Hersteller HP von der preisaggressiven Konkurrenz abzuheben, zeigten wir den Nachteil günstiger Modelle: jede Menge Drama. Und machten HP mit einer 360°-Kampagne zum Synonym für „Drucken ohne Drama“.",
    topMedia: [
      m("HP_DruckenOhneDrama_Couple.mp4", "25\" TVC — Couple"),
      m("HP_DruckenOhneDrama_Mama_Kind.mp4", "25\" TVC — Mama & Kind"),
      m("HP_DruckenOhneDrama_Vater.mp4", "25\" TVC — Vater"),
      m("0000000m7AL000000000pT-background.jpeg"),
      m("0000000m7AL000000000pX-5.jpeg"), m("0000000m7AL000000000pX-6.jpeg"), m("0000000m7AL000000000pX-7.jpeg"),
      m("0000000m7AL000000000pX-13.jpeg"), m("0000000m7AL000000000pX-14.jpeg"), m("0000000m7AL000000000pX-15.jpeg"),
      m("0000000m7AL000000000pX-16.jpeg"), m("0000000m7AL000000000pX-17.jpeg"), m("0000000m7AL000000000pX-18.jpeg")
    ],
    sections: [
      {
        heading: "Explainer Videos",
        media: [
          m("HP_IlluFilm1.mp4", "Animation / Explainer Video 1"),
          m("HP_IlluFilm2.mp4", "Animation / Explainer Video 2")
        ]
      }
    ]
  },
  {
    client: "DGGS",
    title: "JackpotPiraten & BingBong",
    folder: "mernov-dggs",
    cover: "cover-tile.jpeg",
    intro: "Als Online-Glücksspiel 2021 legalisiert wurde, wollte die Deutsche Gesellschaft für Glücksspiel (DGGS) den Markt für sich erobern.",
    sections: [
      {
        heading: "JackpotPiraten",
        text: "Wir entwickelten eine TV-Kampagne mit Ohrwurmpotential, die die Plattform JackpotPiraten deutschlandweit bekannt machte und ganz ohne Seeding über 350.000 YouTube Views erreichte. Für die zockende Zielgruppe zusätzlich Filme im „selbstgedrehten“ Twitch-Look: einfach, authentisch und extrem erfolgreich.",
        media: [
          m("Brand Kampagne/JackPotpiraten_Kampagne.mp4", "20\" Performance TVC"),
          m("Streamer Kampagne/JackpotPiraten_Streamer1.mp4", "Streamer-Look 1"),
          m("Streamer Kampagne/JackpotPiraten_Streamer2.mp4", "Streamer-Look 2")
        ]
      },
      {
        heading: "BingBong",
        text: "Neben den JackpotPiraten gehört DGGS noch eine weitere Online-Plattform: BING BONG. Sie sollte vor allem jüngere Menschen ansprechen — mit einer TV-Kampagne, die sich textlich und visuell klar von den JackpotPiraten unterscheidet, aber den gleichen Ohrwurmcharakter hat. Auch hier ist der „selbstgedrehte“ Twitch-Look voll und ganz beabsichtigt.",
        media: [
          m("Brand Kampagne/BingBong_Kampagne.mp4", "30\" TVC"),
          m("Streamer Kampagne/BingBong_Streamer1.mp4", "Streamer-Look 1"),
          m("Streamer Kampagne/BingBong_Streamer2.mp4", "Streamer-Look 2")
        ]
      }
    ]
  },
  {
    client: "Telekom",
    title: "Beethoven X – The AI Project",
    folder: "beethoven-ai",
    cover: "0000000m7AL000000000ra-background.jpg",
    intro: "Mit Hilfe von künstlicher Intelligenz und renommierten Musikexperten vollendeten wir Beethovens Skizzen zu seinem letzten Werk — der 10. Sinfonie.",
    topMedia: [
      m("BeethovenX_TheAIProject.mp4", "Beethoven X – Casefilm")
    ]
  },
  {
    client: "",
    title: "Lidl",
    folder: "lidl",
    cover: "Lidl - Baby Aktionswoche/0000000m7AL000000000E1-8.jpeg",
    sections: [
      {
        heading: "Baby Aktionswoche",
        media: [
          m("Lidl - Baby Aktionswoche/Lidl_BabyWochen.mp4"),
          h("Drehbegleitendes Shooting."),
          slideshow(["3","4","5","6","7","8","9","10","11"].map(n => `Lidl - Baby Aktionswoche/0000000m7AL000000000E1-${n}.jpeg`))
        ]
      },
      {
        heading: "Käse Aktionswoche",
        media: [
          m("Lidl - Käse Aktionswoche/Lidl_KäseWochen.mp4"),
          h("Drehbegleitendes Shooting."),
          slideshow([
            "Lidl - Käse Aktionswoche/0000000m7AL000000000DX-5.jpeg",
            ...["3","4","5","6","7","8","9","10","11"].map(n => `Lidl - Käse Aktionswoche/0000000m7AL000000000DZ-${n}.jpeg`)
          ])
        ]
      },
      {
        heading: "Aktionsprodukte Kampagne I",
        text: "20\"-TVCs für die wöchentlich wechselnden Non-Food-Themen.",
        media: ["Glamour","Kids","Küche","Lampen","LoungeWear","Sport"]
          .map(n => m(`Aktionsprodukte Kampagne I/Aktionsprodukte ${n}.mp4`, n))
      },
      {
        heading: "Aktionsprodukte Kampagne II",
        text: "20\"-TVCs für die wöchentlich wechselnden Non-Food-Themen.",
        media: ["Babys","Bademode","Garten","Küche","Schlafen","Sport"]
          .map(n => m(`Aktionsprodukte Kampagne II/Aktionsprodukte ${n}.mp4`, n))
      }
    ]
  },
  {
    client: "",
    title: "Alles weitere",
    folder: "diverse-projekte",
    cover: "Gigaset_poolshooting_01.jpeg",
    intro: "Was sonst noch so passiert ist…",
    sections: [
      {
        heading: "Maison Lekka",
        text: "Einführungskampagne für die neue Marke Maison Lekka, die 2025 auf dem Markt kam.",
        media: [
          slideshow([
            "241126_MaisonLekka_Vorsicht_Frau.png",
            "241126_MaisonLekka_SOME.png",
            "241126_MaisonLekka_Vorsicht.png",
            "241126_MaisonLekka_SOME2.png",
            "241126_MaisonLekka_Vorsicht2.png",
            "241126_MaisonLekka_SOME3.png",
            "241126_MaisonLekka_Vorsicht_06.png",
            "241126_MaisonLekka_SOME4.png",
            "241127_MaisonLekka_CLP_VorSupermarkt.png"
          ])
        ]
      },
      {
        heading: "Premier Protein",
        text: "Einführungskampagne auf dem deutschen Markt der Protein Riegel und Shakes.",
        media: [
          slideshow([
            "240916_Layouts_PremierProtein_Route1A2.jpg",
            "240916_Layouts_PremierProtein_FitnessCenter.jpg",
            "240916_Layouts_PremierProtein_Route1.jpg",
            "240916_Layouts_PremierProtein_Route13.jpg",
            "240916_Layouts_PremierProtein_Route1A.jpg",
            "240916_Layouts_PremierProtein_Route1A3.jpg",
            "240916_Layouts_PremierProtein_Route1A4.jpg",
            "Hand_Handy_Insta_Route1.jpg"
          ])
        ]
      },
      {
        heading: "Gigaset",
        text: "Poolshooting der Privat- und Businessgeräte.",
        media: [
          slideshow([1,2,3,4,5,6,7,8,9].map(n => `Gigaset_poolshooting_0${n}.jpeg`))
        ]
      },
      {
        heading: "Volkswagen",
        text: "Verschiedene Printkampagnen.",
        media: ["Classic_Kampagne01_A","Classic_Kampagne01_B","Classic_Kampagne01_C","Nutzfahrzeuge_Kampagne01_A","Nutzfahrzeuge_Kampagne01_B","Nutzfahrzeuge_Kampagne01_C","Nutzfahrzeuge_Kampagne02_A","Nutzfahrzeuge_Kampagne02_B"]
          .map(n => m(`Volkswagen_${n}.jpeg`))
      },
      {
        heading: "Hagebaumarkt",
        text: "„Herbst der helfenden Hände“ TVC.",
        media: [ m("Hagebaumarkt_HerbstderhelfendenHände.mp4") ]
      },
      {
        heading: "Württembergische",
        text: "Kampagne für diverse Produkte der Württembergischen Versicherung. Im Briefing wurden „echte“ Bilder gewünscht — ausschließlich aus Stockdatenbanken.",
        media: [
          slideshow([
            "250107_Layouts_Wü_AOKomm7.jpg",
            "250113_Layouts_Wü_AOKomm_Route1C.jpg",
            "250113_Layouts_Wü_AOKomm_Route1_Rente.jpg",
            "250113_Layouts_Wü_AOKomm_Route1_Vitalbudget.jpg",
            "250114_Layouts_Wü_AOKomm_Route1_Fussi.jpg",
            "250114_Layouts_Wü_AOKomm_Route2_Copy2.jpg",
            "250114_Layouts_Wü_AOKomm_Route2_Kfz.jpg",
            "250114_Layouts_Wü_AOKomm_Route2_Rückbank2.jpg",
            "250114_Layouts_Wü_AOKomm_Route2_final.jpg",
            "250114_Layouts_Wü_AOKomm_Route2_final2.jpg",
            "250114_Layouts_Wü_AOKomm_Route2_neu.jpg"
          ])
        ]
      }
    ]
  },
  {
    client: "",
    title: "Fun Projects",
    folder: "fun-projects",
    cover: "panda-header.jpeg",
    introHeadline: "Unfassbar, aber wahr:",
    intro: "Ich habe ein ganzes Repertoire an spektakulären Hobbies anzubieten, denn ich liebe...",
    topMedia: [
      appLink("apps/kniffel/index.html", "Kniffeln", "pink"),
      appLink("https://www.kleinanzeigen.de/s-bestandsliste.html?userId=27602823", "Verkaufen", "green"),
      comingSoon("Fotografieren", "white"),
      comingSoon("Urlaub", "pink"),
      comingSoon("Meinen Hund", "green")
    ]
  }
];


const ASSET_BASE = "assets/work/";

/* ---------------- NAV background on scroll ---------------- */
const nav = document.querySelector(".nav");
function onScrollNav(){
  nav.classList.toggle("is-scrolled", window.scrollY > 60);
}
window.addEventListener("scroll", onScrollNav, { passive:true });
onScrollNav();

/* ---------------- Intro-Loader: SK zoomt mit Drehung auf die Kamera zu ---------------- */
(function(){
  const loader = document.getElementById("introLoader");
  const loaderLogo = document.getElementById("introLoaderLogo");
  const revealEls = document.querySelectorAll(".hero-reveal");
  if(!loader || !loaderLogo) return;

  function reveal(){
    loader.classList.add("is-hidden");
    revealEls.forEach(el => el.classList.add("is-visible"));
    document.body.style.overflow = "";
    setTimeout(()=> loader.remove(), 900);
  }

  // Nur einmal pro Browser-Sitzung zeigen, nicht bei jedem internen Reload nerven.
  if(sessionStorage.getItem("sk_intro_seen")){
    loader.remove();
    revealEls.forEach(el => el.classList.add("is-visible"));
    return;
  }
  sessionStorage.setItem("sk_intro_seen", "true");
  document.body.style.overflow = "hidden";

  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    reveal();
    return;
  }

  setTimeout(reveal, 980);
})();

/* ---------------- Scroll cue ---------------- */
document.querySelectorAll("[data-scroll-to]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const target = document.querySelector(btn.dataset.scrollTo);
    if(target) target.scrollIntoView({ behavior:"smooth" });
  });
});

/* ---------------- Parallax (hero background) ---------------- */
const parallaxEls = document.querySelectorAll("[data-parallax]");
let ticking = false;
function updateParallax(){
  parallaxEls.forEach(el=>{
    const speed = parseFloat(el.dataset.parallax);
    const sectionTop = el.parentElement.getBoundingClientRect().top;
    const offset = sectionTop * speed;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
  ticking = false;
}
window.addEventListener("scroll", ()=>{
  if(!ticking){
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive:true });
updateParallax();

/* ---------------- Scroll reveal ---------------- */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: "0px 0px -10% 0px" });

document.querySelectorAll("[data-reveal]").forEach(el=> revealObserver.observe(el));

/* ---------------- Build work grid ----------------
   Wird erst NACH dem Passwort-Screen aufgerufen (siehe unten),
   damit die Kampagnenbilder vorher gar nicht erst geladen werden. */
const workGrid = document.getElementById("workGrid");

function isUnlocked(){
  return localStorage.getItem("sk_unlocked") === "true";
}

function renderWorkGrid(){
  workGrid.innerHTML = "";
  PROJECTS.forEach((project, index)=>{
    if(project.protected && !isUnlocked()) return;
    const tile = document.createElement("button");
    tile.className = "work__tile";
    if(project.protected) tile.dataset.protected = "true";
    const label = project.client ? `${project.client} — ${project.title}` : project.title;
    tile.setAttribute("aria-label", `${label} öffnen`);
    tile.innerHTML = `
      <img src="${ASSET_BASE}${project.folder}/${project.cover}" alt="${label}" loading="lazy">
      <div class="work__tile__overlay">
        <div class="work__tile__meta">
          ${project.client ? `<p class="work__tile__client">${project.client}</p>` : ""}
          <p class="work__tile__title">${project.title}</p>
        </div>
      </div>
    `;
    tile.addEventListener("click", ()=> openGallery(index));
    workGrid.appendChild(tile);
  });
}
renderWorkGrid();

/* ---------------- Lightbox (defined first, case-study body fills it) ---------------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, index){
  lightboxImages = images;
  lightboxIndex = index;
  lightboxImg.src = lightboxImages[lightboxIndex];
  lightbox.classList.add("is-open");
}
function closeLightbox(){
  lightbox.classList.remove("is-open");
}
function stepLightbox(dir){
  const total = lightboxImages.length;
  if(!total) return;
  lightboxIndex = (lightboxIndex + dir + total) % total;
  lightboxImg.src = lightboxImages[lightboxIndex];
}

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", ()=> stepLightbox(-1));
lightboxNext.addEventListener("click", ()=> stepLightbox(1));
lightbox.addEventListener("click", (e)=>{
  if(e.target === lightbox) closeLightbox();
});

/* ---------------- Case-study body renderer ---------------- */
function joinPath(folder, file){
  return `${ASSET_BASE}${folder}/${file}`;
}

// Rendert ein einzelnes Medien-Objekt (Bild/Video/Audio) in den übergebenen Container.
function renderMediaItem(container, item, project, imagesForLightbox){
  if(item.type === "heading"){
    const label = document.createElement("p");
    label.className = "case__group-heading";
    label.textContent = item.caption;
    container.appendChild(label);
    return;
  }
  if(item.type === "text"){
    const text = document.createElement("p");
    text.className = "case__group-text";
    text.textContent = item.caption;
    container.appendChild(text);
    return;
  }
  if(item.type === "slideshow"){
    renderSlideshow(container, item, project, imagesForLightbox);
    return;
  }
  if(item.type === "app-link"){
    const card = document.createElement("a");
    card.className = "case__app-link";
    if(item.hoverColor) card.classList.add(`case__app-link--${item.hoverColor}`);
    card.href = item.url;
    card.target = "_blank";
    card.rel = "noopener";
    card.innerHTML = `
      <span class="case__app-link__title">${item.caption}</span>
      <span class="case__app-link__arrow">→</span>
    `;
    container.appendChild(card);
    return;
  }
  if(item.type === "coming-soon"){
    const card = document.createElement("div");
    card.className = "case__app-link case__app-link--soon";
    if(item.hoverColor) card.classList.add(`case__app-link--${item.hoverColor}`);
    card.innerHTML = `
      <span class="case__app-link__title">${item.caption}</span>
      <span class="case__app-link__badge">Coming soon</span>
    `;
    container.appendChild(card);
    return;
  }

  const fig = document.createElement("figure");
  fig.className = `case__media-item case__media-item--${item.type}`;

  if(item.type === "image"){
    const img = document.createElement("img");
    img.src = joinPath(project.folder, item.file);
    img.alt = item.caption || `${project.client} — ${project.title}`;
    img.loading = "lazy";
    const idx = imagesForLightbox.length;
    imagesForLightbox.push(img.src);
    img.addEventListener("click", ()=> openLightbox(imagesForLightbox, idx));
    fig.appendChild(img);
  } else if(item.type === "video"){
    const video = document.createElement("video");
    video.src = joinPath(project.folder, item.file);
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    fig.appendChild(video);
  } else if(item.type === "audio"){
    const audio = document.createElement("audio");
    audio.src = joinPath(project.folder, item.file);
    audio.controls = true;
    audio.preload = "metadata";
    fig.appendChild(audio);
  }

  if(item.caption){
    const cap = document.createElement("figcaption");
    cap.className = "case__media-caption";
    cap.textContent = item.caption;
    fig.appendChild(cap);
  }
  container.appendChild(fig);
}

// Rendert eine durchklickbare Slideshow: ein Bild sichtbar, Pfeile blättern, Klick öffnet die Lightbox.
function renderSlideshow(container, item, project, imagesForLightbox){
  const srcs = item.files.map(f => joinPath(project.folder, f));
  const startIdx = imagesForLightbox.length;
  srcs.forEach(src => imagesForLightbox.push(src));

  let current = 0;

  const wrap = document.createElement("div");
  wrap.className = "case__slideshow";

  const viewport = document.createElement("div");
  viewport.className = "case__slideshow-viewport";

  const img = document.createElement("img");
  img.src = srcs[0];
  img.alt = item.caption || `${project.client} — ${project.title}`;
  img.addEventListener("click", ()=> openLightbox(imagesForLightbox, startIdx + current));
  viewport.appendChild(img);

  const counter = document.createElement("div");
  counter.className = "case__slideshow-counter";
  counter.textContent = `1 / ${srcs.length}`;
  viewport.appendChild(counter);

  function show(i){
    current = (i + srcs.length) % srcs.length;
    img.src = srcs[current];
    counter.textContent = `${current + 1} / ${srcs.length}`;
  }

  if(srcs.length > 1){
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "case__slideshow-nav case__slideshow-nav--prev";
    prevBtn.setAttribute("aria-label", "Vorheriges Bild");
    prevBtn.innerHTML = "&#8249;";
    prevBtn.addEventListener("click", (e)=>{ e.stopPropagation(); show(current - 1); });
    viewport.appendChild(prevBtn);

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "case__slideshow-nav case__slideshow-nav--next";
    nextBtn.setAttribute("aria-label", "Nächstes Bild");
    nextBtn.innerHTML = "&#8250;";
    nextBtn.addEventListener("click", (e)=>{ e.stopPropagation(); show(current + 1); });
    viewport.appendChild(nextBtn);
  }

  wrap.appendChild(viewport);

  if(item.caption){
    const cap = document.createElement("p");
    cap.className = "case__slideshow-caption";
    cap.textContent = item.caption;
    wrap.appendChild(cap);
  }

  container.appendChild(wrap);
}

function renderMediaGrid(mediaList, project, imagesForLightbox){
  const grid = document.createElement("div");
  grid.className = "case__media";
  mediaList.forEach(item => {
    if(item.protected && !isUnlocked()) return;
    renderMediaItem(grid, item, project, imagesForLightbox);
  });
  return grid;
}

/* ---------------- Gallery overlay ---------------- */
const galleryOverlay = document.getElementById("galleryOverlay");
const galleryBody = document.getElementById("galleryBody");
const galleryTitle = document.getElementById("galleryTitle");
const galleryClient = document.getElementById("galleryClient");
const galleryClose = document.getElementById("galleryClose");

let currentGalleryIndex = null;

function openGallery(index){
  const project = PROJECTS[index];
  if(project.protected && !isUnlocked()) return;
  currentGalleryIndex = index;
  galleryClient.textContent = project.client;
  galleryClient.style.display = project.client ? "" : "none";
  galleryTitle.textContent = project.title;
  galleryBody.innerHTML = "";

  const imagesForLightbox = [];

  if(project.introHeadline){
    const headline = document.createElement("p");
    headline.className = "case__intro-headline";
    headline.textContent = project.introHeadline;
    galleryBody.appendChild(headline);
  }
  if(project.intro){
    const intro = document.createElement("p");
    intro.className = "case__intro" + (project.introHeadline ? " case__intro--sub" : "");
    intro.textContent = project.intro;
    galleryBody.appendChild(intro);
  }

  if(project.topMedia){
    galleryBody.appendChild(renderMediaGrid(project.topMedia, project, imagesForLightbox));
  }

  if(project.sections){
    project.sections.forEach(section=>{
      if(section.protected && !isUnlocked()) return;
      const wrap = document.createElement("section");
      wrap.className = "case__section";

      const heading = document.createElement("h4");
      heading.className = "case__section-heading";
      heading.textContent = section.heading;
      wrap.appendChild(heading);

      if(section.text){
        const text = document.createElement("p");
        text.className = "case__section-text";
        text.textContent = section.text;
        wrap.appendChild(text);
      }

      wrap.appendChild(renderMediaGrid(section.media, project, imagesForLightbox));
      galleryBody.appendChild(wrap);
    });
  }

  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.className = "overlay-back";
  backBtn.innerHTML = `<span class="overlay-back__arrow">←</span> Back`;
  backBtn.addEventListener("click", closeGallery);
  galleryBody.appendChild(backBtn);

  galleryOverlay.classList.add("is-open");
  galleryOverlay.scrollTop = 0;
  document.body.style.overflow = "hidden";
  window.dispatchEvent(new CustomEvent("panda-hunt:refresh"));
}

function closeGallery(){
  galleryOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
  currentGalleryIndex = null;
  // Videos/Audios stoppen, die im Hintergrund weiterlaufen könnten
  galleryBody.querySelectorAll("video, audio").forEach(el => el.pause());
}
galleryClose.addEventListener("click", closeGallery);

/* ---------------- About overlay ---------------- */
const aboutOverlay = document.getElementById("aboutOverlay");
const aboutClose = document.getElementById("aboutClose");
const navAbout = document.getElementById("navAbout");

function openAbout(){
  aboutOverlay.classList.add("is-open");
  aboutOverlay.scrollTop = 0;
  document.body.style.overflow = "hidden";
  window.dispatchEvent(new CustomEvent("panda-hunt:refresh"));
}
function closeAbout(){
  aboutOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
}
aboutClose.addEventListener("click", closeAbout);
document.getElementById("aboutBack").addEventListener("click", closeAbout);
navAbout.addEventListener("click", (e)=>{
  e.preventDefault();
  openAbout();
});

document.addEventListener("keydown", (e)=>{
  if(lightbox.classList.contains("is-open")){
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") stepLightbox(-1);
    if(e.key === "ArrowRight") stepLightbox(1);
  } else if(aboutOverlay.classList.contains("is-open")){
    if(e.key === "Escape") closeAbout();
  } else if(galleryOverlay.classList.contains("is-open")){
    if(e.key === "Escape") closeGallery();
  }
});

/* ---------------- Footer year ---------------- */
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("yearAbout").textContent = new Date().getFullYear();

/* ============================================================
   SPITZNAMEN-GENERATOR
   Reine Wortlisten + Zufall im Browser — braucht kein Backend
   und keinen API-Key. Wortlisten unten frei erweiterbar.
   ============================================================ */
const NICKNAME_TITLES = {
  female: ["Queen", "Princess", "Diva", "Lady", "Duchess", "Empress", "Goddess", "Boss Lady"],
  male: ["King", "Boss", "Master", "Champion", "Chief", "Captain", "Duke", "Baron"],
  neutral: ["Captain", "Chaos Fairy", "Legend", "Superstar", "Genius", "Phantom", "Champion", "Oracle"]
};

const NICKNAME_WORDS = {
  powerpoint: ["Slide Master", "Bullet Point", "Cover Slide", "Agenda Slide", "Lorem Ipsum", "Fade-In", "Animation Path", "Black Box Chart", "Executive Summary", "Backup Slide", "Placeholder Text", "Corporate Template", "Click Dummy", "Footer", "Handout Mode", "Presenter Mode", "Notes View", "Master Slide"],
  marketing: ["Buyer Persona", "Low-Hanging Fruit", "Blue-Sky Thinking", "Big Idea", "Purpose", "Touchpoint", "Deep Dive", "Learnings", "Nice-to-Have", "Quick Win", "Elevator Pitch", "Out-of-the-Box", "Content Piece", "Awareness", "Customer Journey", "Storytelling", "Best Practice", "Kick-off"],
  feedback: ["Make the Logo Bigger", "ASAP", "Just a Small Change", "Friday EOD", "One More Round", "Can We A/B This", "More Blue Please", "Louder Font", "Make it Feel Premium", "Version 47 Final Final", "I'll Know it When I See it", "Can We See 10 More Options", "Less but Also More", "Can You Make it Younger", "Just a Gut Feeling", "Can We Add Motion"],
  animals: ["Sloth", "Wombat", "Meerkat", "Flamingo", "Naked Mole Rat", "Jellyfish", "Axolotl", "Raccoon", "Penguin", "Alpaca", "Chinchilla", "Seahorse", "Cockatoo", "Wild Boar", "Ferret", "Gecko", "Otter", "Hedgehog"],
  colors: ["Turquoise", "Magenta", "Neon Yellow", "Neon Pink", "Purple", "Mint Green", "Cobalt Blue", "Burgundy", "Aquamarine", "Lemon Yellow", "Flamingo Pink", "Charcoal", "Champagne", "Teal", "Coral", "Silver Grey"]
};

// Nur die Animals-Kategorie braucht für "of ..." eine echte Mehrzahlform
// (bei den anderen Kategorien sind es Phrasen/Fachbegriffe, die man nicht einfach pluralisiert).
const NICKNAME_PLURALS = {
  Sloth: "Sloths", Wombat: "Wombats", Meerkat: "Meerkats", Flamingo: "Flamingos",
  "Naked Mole Rat": "Naked Mole Rats", Jellyfish: "Jellyfish", Axolotl: "Axolotls", Raccoon: "Raccoons",
  Penguin: "Penguins", Alpaca: "Alpacas", Chinchilla: "Chinchillas", Seahorse: "Seahorses",
  Cockatoo: "Cockatoos", "Wild Boar": "Wild Boars", Ferret: "Ferrets", Gecko: "Geckos",
  Otter: "Otters", Hedgehog: "Hedgehogs"
};

const NICKNAME_TEMPLATES = [
  (title, word) => `${title} ${word}`,
  (title, word) => `${word} ${title}`,
  (title, word) => `${title} of ${NICKNAME_PLURALS[word] || word}`,
  (title, word) => `${word} ${title} Supreme`
];

function pickRandom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNickname(gender, category){
  const title = pickRandom(NICKNAME_TITLES[gender]);
  const word = pickRandom(NICKNAME_WORDS[category]);
  const template = pickRandom(NICKNAME_TEMPLATES);
  return template(title, word);
}

let selectedGender = null;
let selectedCategory = null;

const genderPills = document.querySelectorAll("#genderPills .pill");
const categoryPills = document.querySelectorAll("#categoryPills .pill");
const generateBtn = document.getElementById("generateBtn");
const resultName = document.getElementById("resultName");

function refreshGenerateState(){
  generateBtn.disabled = !(selectedGender && selectedCategory);
}

genderPills.forEach(pill=>{
  pill.addEventListener("click", ()=>{
    genderPills.forEach(p=>p.classList.remove("is-active"));
    pill.classList.add("is-active");
    selectedGender = pill.dataset.value;
    refreshGenerateState();
  });
});

categoryPills.forEach(pill=>{
  pill.addEventListener("click", ()=>{
    categoryPills.forEach(p=>p.classList.remove("is-active"));
    pill.classList.add("is-active");
    selectedCategory = pill.dataset.value;
    refreshGenerateState();
  });
});

function revealNickname(){
  resultName.classList.remove("is-visible");
  const name = generateNickname(selectedGender, selectedCategory);
  requestAnimationFrame(()=>{
    resultName.textContent = name;
    resultName.classList.add("is-visible");
    document.querySelectorAll('.contact__form [name="name"]').forEach(field => field.value = name);
  });
}

generateBtn.addEventListener("click", revealNickname);
refreshGenerateState();

/* ============================================================
   KONTAKTFORMULAR
   Sendet per Formspree (kein eigenes Backend nötig).
   WICHTIG: "YOUR_FORM_ID" im HTML muss durch die echte
   Formspree-Formular-ID ersetzt werden, siehe Anleitung im Chat.
   ============================================================ */
document.querySelectorAll(".contact__form").forEach(contactForm=>{
  contactForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const submitBtn = contactForm.querySelector(".contact__submit");
    const contactStatus = contactForm.querySelector(".contact__form-status");
    const actionUrl = contactForm.getAttribute("action");

    if (actionUrl.includes("YOUR_FORM_ID")) {
      contactStatus.textContent = "Formular noch nicht verbunden — siehe Setup-Anleitung.";
      contactStatus.classList.add("is-error");
      return;
    }

    submitBtn.disabled = true;
    contactStatus.classList.remove("is-error");
    contactStatus.textContent = "Wird gesendet …";

    try {
      const response = await fetch(actionUrl, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      });
      if (response.ok) {
        contactStatus.textContent = "Danke! Deine Nachricht ist unterwegs. ✨";
        contactForm.reset();
      } else {
        contactStatus.textContent = "Hm, das hat nicht geklappt. Schreib mir gerne direkt per Mail.";
        contactStatus.classList.add("is-error");
      }
    } catch (err) {
      contactStatus.textContent = "Hm, das hat nicht geklappt. Schreib mir gerne direkt per Mail.";
      contactStatus.classList.add("is-error");
    } finally {
      submitBtn.disabled = false;
    }
  });
});

/* ============================================================
   PASSWORT-BEREICH
   Kein echter Schutz (rein clientseitig, kein Backend) — die Seite
   selbst ist frei zugänglich. Nur ein paar einzelne Arbeiten (siehe
   "protected: true" oben in PROJECTS) bleiben verborgen, bis hier
   das Passwort eingegeben wird. Passwort hier ändern:
   ============================================================ */
const SITE_PASSWORD = "MoreWork";

const passwordGate = document.getElementById("passwordGate");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");
const passwordClose = document.getElementById("passwordClose");
const unlockTrigger = document.getElementById("unlockTrigger");
const unlockTriggerTop = document.getElementById("unlockTriggerTop");

function openPasswordGate(){
  passwordGate.classList.remove("is-hidden");
  passwordInput.focus();
}
function closePasswordGate(){
  passwordGate.classList.add("is-hidden");
  passwordError.hidden = true;
  passwordInput.value = "";
}
unlockTrigger.addEventListener("click", openPasswordGate);
unlockTriggerTop.addEventListener("click", openPasswordGate);
passwordClose.addEventListener("click", closePasswordGate);

passwordForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  if(passwordInput.value === SITE_PASSWORD){
    localStorage.setItem("sk_unlocked", "true");
    closePasswordGate();
    renderWorkGrid();
    // Falls gerade eine Case Study offen ist, neu aufbauen, damit
    // frisch freigeschaltete Abschnitte sofort sichtbar werden.
    if(currentGalleryIndex !== null) openGallery(currentGalleryIndex);
  } else {
    passwordError.hidden = false;
    passwordInput.value = "";
    passwordInput.focus();
  }
});

/* ============================================================
   CALENDLY POPUP
   Öffnet den Kalender als Overlay auf der Seite, statt zu Calendly
   zu verlinken — so bleibt man auf saskiakrug.com. Fällt auf den
   normalen Link zurück, falls das Widget-Skript nicht lädt.
   ============================================================ */
document.querySelectorAll(".contact__book").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    if(window.Calendly){
      e.preventDefault();
      Calendly.initPopupWidget({ url: btn.href });
    }
  });
});

// Kommt man mit #fun-projects zurück (z. B. von Kniffel/Blog), direkt die
// Fun-Projects-Übersicht öffnen, statt nur auf der Startseite zu landen.
if(location.hash === "#fun-projects"){
  const funProjectsIndex = PROJECTS.findIndex(p => p.title === "Fun Projects");
  if(funProjectsIndex !== -1) openGallery(funProjectsIndex);
}
