export type EtymologyEntry = {
  id: string;
  word: string;
  phonetic?: string;
  origin: string;
  sense: string;
  note?: string;
};

/** Seed catalog — word origins, senses, and brief notes for study. */
export const ETYMOLOGY_ENTRIES: EtymologyEntry[] = [
  {
    id: "analogy",
    word: "analogy",
    phonetic: "/əˈnæl.ə.dʒi/",
    origin:
      "From Latin analogia, from Greek ἀναλογία (analogía) “proportion, reciprocity,” from ἀνά (aná) “up, upon, according to” + λόγος (lógos) “word, reason, ratio.” The Greek sense was mathematical and logical: a sameness of ratios.",
    sense:
      "A correspondence between relations rather than between things themselves—an inference that if A is to B as C is to D, knowledge of one pair can illuminate the other. In rhetoric and cognition, a patterned likeness used to explain, persuade, or invent.",
    note: "Distinguish from metaphor: metaphor often collapses two domains into identity (“time is money”); analogy keeps the proportional scaffold visible (“time is to life as money is to a ledger”).",
  },
  {
    id: "metaphor",
    word: "metaphor",
    phonetic: "/ˈmɛt.ə.fɔːr/",
    origin:
      "From Latin metaphora, from Greek μεταφορά (metaphorá) “a transfer,” from μεταφέρω (metaphérō) “I carry over,” from μετά (metá) “after, across, beyond” + φέρω (phérō) “I bear, carry.”",
    sense:
      "A figure that transfers a name or image from its ordinary domain to another, so that one thing is spoken of as if it were another. The “carrying over” is the etymological core: sense migrates.",
    note: "Aristotle treats metaphor as a kind of analogy in compressed form; later rhetoric often opposes them. The shared Greek root of transfer and transport is not accidental.",
  },
  {
    id: "allegory",
    word: "allegory",
    phonetic: "/ˈæl.ə.ɡɔːr.i/",
    origin:
      "From Latin allegoria, from Greek ἀλληγορία (allēgoría) “speaking otherwise,” from ἄλλος (állos) “other” + ἀγορεύω (agoreúō) “I speak in the assembly,” related to ἀγορά (agorá) “marketplace, public square.”",
    sense:
      "A sustained narrative or image-system in which persons, events, and settings stand for abstract meanings—speech that says one thing in the forum of the page while meaning another.",
    note: "Where metaphor may flash in a phrase, allegory tends to occupy a whole work: Bunyan’s road, Spenser’s knights, Orwell’s farm.",
  },
  {
    id: "symbol",
    word: "symbol",
    phonetic: "/ˈsɪm.bəl/",
    origin:
      "From Latin symbolum “token, mark,” from Greek σύμβολον (sýmbolon) “tally, token of identity,” from συμβάλλω (symbállō) “I throw together, compare,” from σύν (sýn) “with” + βάλλω (bállō) “I throw.”",
    sense:
      "Originally a broken object whose matching half proved recognition—then any sign that stands for something by convention, association, or participation. A symbol gathers (throws together) meaning and mark.",
    note: "The passport-stamp sense of σύμβολον as a credential still haunts theological and psychoanalytic uses: the symbol authenticates a relation.",
  },
  {
    id: "sign",
    word: "sign",
    phonetic: "/saɪn/",
    origin:
      "From Old French signe, from Latin signum “mark, token, signal, standard,” of uncertain further origin; possibly related to secāre “to cut” (a mark cut in) or to a root for following/seeking.",
    sense:
      "Anything that indicates, points to, or stands for something else—natural (smoke for fire) or conventional (letters for sounds). In semiotics, the basic unit of signification.",
    note: "English kept both the noun and the verb (to sign); signature and ensign preserve the Latin family of authorized marks.",
  },
  {
    id: "icon",
    word: "icon",
    phonetic: "/ˈaɪ.kɒn/",
    origin:
      "From Latin īcōn, from Greek εἰκών (eikṓn) “likeness, image, portrait,” from a root related to seeming or resembling (*weik- / *weid- debates aside, the Greek sense is clearly imagistic).",
    sense:
      "An image that represents by resemblance; in Byzantine Christianity, a sacred likeness; in computing and design, a compressed pictorial stand-in for an action, file, or brand.",
    note: "Peirce’s “icon” is the sign that signifies by similarity—closer to eikṓn than to the app-grid sense, though both live in the word now.",
  },
  {
    id: "index",
    word: "index",
    phonetic: "/ˈɪn.dɛks/",
    origin:
      "From Latin index “forefinger, informer, sign, catalogue,” from indicāre “to point out, show,” from in- “in, on” + dicāre “to proclaim,” related to dīcere “to say.”",
    sense:
      "That which points: the finger, then the pointer in a book, then any ordered list that guides retrieval. In Peirce, the index is the sign linked to its object by causal or existential connection (smoke, a weathercock, a footprint).",
    note: "The digit that points and the page that points share one Latin career; digital later takes another Latin path through digitus.",
  },
  {
    id: "schema",
    word: "schema",
    phonetic: "/ˈskiː.mə/",
    origin:
      "From Greek σχῆμα (skhêma) “form, shape, figure, appearance,” from ἔχω (ékhō) “I have, hold” via a related stem for holding a form. Latinized as schēma.",
    sense:
      "An outline or structured pattern—geometric, cognitive, or rhetorical—under which particulars are organized. Kant’s schemata mediate between categories and appearances; in psychology, schemas are knowledge frames.",
    note: "Scheme and schematic are the same Greek family diluted into plot and diagram.",
  },
  {
    id: "form",
    word: "form",
    phonetic: "/fɔːrm/",
    origin:
      "From Old French forme, from Latin forma “shape, figure, mold, beauty,” of uncertain etymology—possibly Etruscan or related to roots for cutting/shaping. Greek μορφή (morphḗ) is a parallel, not a parent.",
    sense:
      "The shape or arrangement of a thing as distinct from its matter; a mold that confers identity; in philosophy, the intelligible structure that makes a thing what it is (Aristotle’s μορφή / εἶδος complex).",
    note: "Formal, formula, and reform all keep the sense of shaping according to a pattern.",
  },
  {
    id: "figure",
    word: "figure",
    phonetic: "/ˈfɪɡ.ər/",
    origin:
      "From Latin figūra “shape, form, image,” from fingere “to shape, mold, invent, feign.” Related to fiction and effigy through the same verb of making-by-hand.",
    sense:
      "A shape, number, or person as seen; a rhetorical turn (figure of speech); a diagram in a book. Across senses runs the idea of something fashioned into a perceptible outline.",
    note: "In ornament catalogs, “figure” still means the numbered plate—an image shaped for study.",
  },
  {
    id: "pattern",
    word: "pattern",
    phonetic: "/ˈpæt.ərn/",
    origin:
      "From Middle English patron, from Old French patron “patron, model, pattern,” from Latin patrōnus “protector, advocate,” from pater “father.” The sense shifted from a person who is a model to a model as such.",
    sense:
      "A model to be copied; a repeated decorative or structural arrangement; a detectable regularity. The word moved from guardianship to template.",
    note: "Patron and pattern split in spelling as their senses diverged; both once named the authoritative example.",
  },
  {
    id: "motif",
    word: "motif",
    phonetic: "/məʊˈtiːf/",
    origin:
      "From French motif “motive, subject, theme,” from Medieval Latin motivum “moving cause,” from Latin movēre “to move.” Entered English for art and music in the nineteenth century.",
    sense:
      "A recurring element—melodic, visual, or narrative—that moves through a work as a recognizable unit. In ornament, a repeatable design cell.",
    note: "Motive and motif are etymological twins; English kept one for causation and borrowed the French form for art.",
  },
  {
    id: "ornament",
    word: "ornament",
    phonetic: "/ˈɔːr.nə.mənt/",
    origin:
      "From Old French ornement, from Latin ornāmentum “equipment, adornment,” from ornāre “to equip, adorn,” possibly related to order (ōrdō) through a sense of fitting out properly.",
    sense:
      "That which adorns; historically also the gear that completes a person or place. In design history, the contested surplus (or necessity) of decoration on useful form.",
    note: "Loos’s “ornament and crime” depends on a modern thinning of ornāmentum from honorable equipment to superfluous trim.",
  },
  {
    id: "decor",
    word: "décor",
    phonetic: "/ˈdeɪ.kɔːr/",
    origin:
      "From French décor “decoration, scenery,” from décorer, from Latin decorāre “to beautify,” from decus, decor “beauty, grace, honor,” related to decent and dignity.",
    sense:
      "The arrangement of surfaces and objects that sets a scene—theatrical, interior, or social. Decorum is the sister word for fitting behavior.",
    note: "What is “decent” and what is “decorative” share a Latin root in what is fitting and honorable to show.",
  },
  {
    id: "design",
    word: "design",
    phonetic: "/dɪˈzaɪn/",
    origin:
      "From Latin designāre “to mark out, appoint,” from de- “out” + signāre “to mark,” from signum “sign.” Through French and Italian into English as both plan and intention.",
    sense:
      "To mark out in advance: a plan, a purpose, or the shaping of artifacts according to intent. Design holds together intention (what is meant) and inscription (what is marked).",
    note: "When someone asks whether an outcome was “by design,” they revive the oldest sense: appointed, not accidental.",
  },
  {
    id: "type",
    word: "type",
    phonetic: "/taɪp/",
    origin:
      "From Latin typus, from Greek τύπος (týpos) “blow, impression, stamp, model,” from τύπτω (týptō) “I strike.” The mark left by a strike becomes the model for copies.",
    sense:
      "A category or exemplar; in printing, a cast letter; in theology, a foreshadowing figure. Across uses, type is the impressed form that generates likenesses.",
    note: "Prototype, archetype, and stereotype all keep the Greek blow/impression inside modern abstraction.",
  },
  {
    id: "archetype",
    word: "archetype",
    phonetic: "/ˈɑːr.kɪ.taɪp/",
    origin:
      "From Latin archetypum, from Greek ἀρχέτυπον (arkhétypon) “first-molded pattern,” from ἀρχή (arkhḗ) “beginning, rule” + τύπος (týpos) “impression, model.”",
    sense:
      "The original pattern from which copies derive; in Jung, a primordial image-form in the collective psyche; more loosely, a stock character or deep template.",
    note: "Architecture shares ἀρχή as “ruling principle,” but archetype keeps the stamp metaphor explicit.",
  },
  {
    id: "prototype",
    word: "prototype",
    phonetic: "/ˈprəʊ.tə.taɪp/",
    origin:
      "From Greek πρωτότυπον (prōtótypon) “original form,” from πρῶτος (prôtos) “first” + τύπος (týpos) “impression.” Via Latin and French into technical English.",
    sense:
      "A first full-scale or functional model used to test and refine a design before reproduction. The “first impression” made tangible.",
    note: "In product work the prototype is less sacred original than disposable oracle—still etymologically the first stamp.",
  },
  {
    id: "paradigm",
    word: "paradigm",
    phonetic: "/ˈpær.ə.daɪm/",
    origin:
      "From Late Latin paradīgma, from Greek παράδειγμα (parádeigma) “pattern, example, precedent,” from παραδείκνυμι (paradeíknumi) “I show side by side,” from παρά (pará) “beside” + δείκνυμι (deíknumi) “I show.”",
    sense:
      "An example that shows the rule; a grammatical model; after Kuhn, a shared framework of normal science. Always a showing-beside that teaches by display.",
    note: "Paradeigma is closer to “exhibit” than to “worldview”; the Kuhnian inflation is modern.",
  },
  {
    id: "example",
    word: "example",
    phonetic: "/ɪɡˈzɑːm.pəl/",
    origin:
      "From Old French example, from Latin exemplum “sample, specimen, warning, model,” from eximere “to take out,” from ex- “out” + emere “to take, buy.” A piece taken out to stand for the rest.",
    sense:
      "A particular taken from a class to illustrate the class; a model of conduct; historically also a cautionary case. Sampling and exemplarity share the same extraction.",
    note: "Exempt and redeem are cousins through emere—taking out, buying back.",
  },
  {
    id: "specimen",
    word: "specimen",
    phonetic: "/ˈspɛs.ɪ.mən/",
    origin:
      "From Latin specimen “mark, example, indication,” from specere “to look at,” the same root as spectacle, inspect, and species. Something set forth to be looked at.",
    sense:
      "An individual taken as representative of a kind—botanical, medical, or bibliographic. The specimen is evidence you can see.",
    note: "In ornament research, plates behave like specimens: visual samples of a grammar of form.",
  },
  {
    id: "species",
    word: "species",
    phonetic: "/ˈspiː.ʃiːz/",
    origin:
      "From Latin speciēs “appearance, form, kind, spectacle,” from specere “to look.” In logic and biology, the visible (or defined) kind within a genus.",
    sense:
      "A class of individuals sharing defining characters; more broadly, a kind as it appears to classification. Etymologically, kinds begin as appearances.",
    note: "Special, spice, and specious all wander from the same looking-root into particularity, flavor, and false seeming.",
  },
  {
    id: "genus",
    word: "genus",
    phonetic: "/ˈdʒiː.nəs/",
    origin:
      "From Latin genus “birth, descent, race, kind,” from a Proto-Indo-European root *ǵenh₁- “to produce, give birth,” shared with generate, genetic, kin, and kind.",
    sense:
      "A class more general than species; a family of related forms. Kindness and kind (sort) are English echoes of the same birth-root.",
    note: "Taxonomy’s genus/species pair maps Latin kinship language onto nature’s filing cabinet.",
  },
  {
    id: "category",
    word: "category",
    phonetic: "/ˈkæt.ə.ɡɔːr.i/",
    origin:
      "From Latin catēgoria, from Greek κατηγορία (katēgoría) “accusation, assertion,” from κατηγορέω (katēgoréō) “I accuse, speak against in public,” from κατά (katá) “against, down” + ἀγορεύω (agoreúō) “I speak in the assembly.”",
    sense:
      "In Aristotle, a highest predicate-type under which beings are said; later, any class in a system of classification. The word begins as courtroom speech, not as a drawer label.",
    note: "To categorize was first to charge—then to assert what something is under a heading.",
  },
  {
    id: "concept",
    word: "concept",
    phonetic: "/ˈkɒn.sɛpt/",
    origin:
      "From Latin conceptus “a taking in, conception,” from concipere “to take in, conceive,” from com- “together” + capere “to seize, take.” Related to capture, perceive, and recipe.",
    sense:
      "A mental grasp that holds many particulars under one idea; the conceived content of thought. Conception and concept share the metaphor of taking-into-mind.",
    note: "German Begriff (“grasp”) rhymes etymologically with the Latin seizing inside concept.",
  },
  {
    id: "idea",
    word: "idea",
    phonetic: "/aɪˈdɪə/",
    origin:
      "From Latin idea, from Greek ἰδέα (idéa) “form, appearance, kind,” from ἰδεῖν (ideîn) “to see,” from a root *weyd- “to see,” shared with vision, wit, and Veda.",
    sense:
      "In Plato, a transcendent Form known by intellect; in ordinary English, a thought, plan, or notion. Seeing and knowing are braided in the oldest sense.",
    note: "Ideology and ideal keep the Greek seeing-word inside modern systems and aspirations.",
  },
  {
    id: "image",
    word: "image",
    phonetic: "/ˈɪm.ɪdʒ/",
    origin:
      "From Old French image, from Latin imāgō “copy, likeness, ghost, ancestor mask,” related to imitārī “to imitate.” Possibly from a root for copying or aiming.",
    sense:
      "A likeness—optical, mental, or sculpted. Also reputation (“public image”) and the mental picture that guides action. Imitation is the verb of the same family.",
    note: "Roman funeral imagines (ancestor masks) sit behind later senses of image as social presence.",
  },
  {
    id: "imagination",
    word: "imagination",
    phonetic: "/ɪˌmædʒ.ɪˈneɪ.ʃən/",
    origin:
      "From Latin imāginātiō, from imāginārī “to form an image, fancy,” from imāgō. Through Old French into Middle English as the faculty of making likenesses within.",
    sense:
      "The power to form mental images not currently present to the senses; more broadly, creative invention. Fancy and fantasy are near-synonyms with different Greek/Latin paths.",
    note: "Coleridge’s split of imagination/fancy is a Romantic refinement, not an etymological one—both orbit image-making.",
  },
  {
    id: "perception",
    word: "perception",
    phonetic: "/pəˈsɛp.ʃən/",
    origin:
      "From Latin perceptiō “a taking, receiving,” from percipere “to seize wholly, observe,” from per- “thoroughly” + capere “to take.”",
    sense:
      "The taking-in of sensory or cognitive content; awareness as reception. To perceive is to capture appearance thoroughly enough to hold it as knowledge.",
    note: "Concept and perception both seize (capere); one seizes into idea, the other seizes from the world.",
  },
  {
    id: "attention",
    word: "attention",
    phonetic: "/əˈtɛn.ʃən/",
    origin:
      "From Latin attentiō, from attendere “to stretch toward, heed,” from ad- “to” + tendere “to stretch.” Related to tension, tent, and tendency.",
    sense:
      "The stretching of mind toward an object; care, notice, military readiness. Attention is directional strain, not passive glow.",
    note: "To attend a lecture and to wait in attendance both keep the Latin leaning-toward.",
  },
  {
    id: "intention",
    word: "intention",
    phonetic: "/ɪnˈtɛn.ʃən/",
    origin:
      "From Latin intentiō “a stretching, purpose, accusation,” from intendere “to stretch toward, aim,” from in- “toward” + tendere “to stretch.” Twin of attention with inward aim.",
    sense:
      "A directed purpose; in phenomenology, the mind’s directedness toward objects (Brentano/Husserl). Aiming and meaning-to share the stretch.",
    note: "Intense and intend are the same tendon of language: something pulled taut toward a mark.",
  },
  {
    id: "memory",
    word: "memory",
    phonetic: "/ˈmɛm.ə.ri/",
    origin:
      "From Latin memoria “memory, remembrance,” from memor “mindful,” from a Proto-Indo-European root *(s)mer- “to remember, care for,” related to mourn and (via Greek) martyr.",
    sense:
      "The faculty of retaining and recalling past experience; also a memorial object or written record. Care and recollection share an ancient root.",
    note: "Memoir and commemorate keep the mindful Latin; amnesia is the Greek negation of remembering (μνήμη).",
  },
  {
    id: "history",
    word: "history",
    phonetic: "/ˈhɪs.tə.ri/",
    origin:
      "From Latin historia “narrative of past events, inquiry,” from Greek ἱστορία (historía) “inquiry, knowledge from inquiry, narrative,” from ἵστωρ (hístōr) “one who knows, judge,” related to seeing/knowing (*weyd-).",
    sense:
      "Inquiry into the past and the narrative that results; also the past itself as a field of events. Story is the shortened English twin.",
    note: "Herodotus calls his work historíai—inquiries—not yet “history” as school subject.",
  },
  {
    id: "archive",
    word: "archive",
    phonetic: "/ˈɑːr.kaɪv/",
    origin:
      "From French archives (plural), from Latin archīum / archīvum, from Greek ἀρχεῖον (arkheîon) “public building, residence of the magistrates,” from ἀρχή (arkhḗ) “government, beginning.”",
    sense:
      "A place where public records are kept; the body of records; the act of depositing. Power and beginning share ἀρχή with the archive’s institutional birth.",
    note: "Derrida’s Archive Fever presses on this link: the archive is not neutral storage but a house of authority.",
  },
  {
    id: "catalog",
    word: "catalog",
    phonetic: "/ˈkæt.ə.lɒɡ/",
    origin:
      "From Late Latin catalogus, from Greek κατάλογος (katálogos) “register, list,” from καταλέγω (katalégō) “I reckon up, recount,” from κατά (katá) “down, thoroughly” + λέγω (légō) “I say, gather, choose.”",
    sense:
      "An ordered enumeration of items for reference or sale; the act of listing. Cataloging is thorough saying-through of a collection.",
    note: "Légo’s double life—saying and gathering—makes the catalog both speech and inventory.",
  },
  {
    id: "museum",
    word: "museum",
    phonetic: "/mjuːˈziː.əm/",
    origin:
      "From Latin mūsēum “library, study,” from Greek Μουσεῖον (Mouseîon) “seat of the Muses,” from Μοῦσα (Moûsa) “Muse.” The Alexandrian Mouseion was a research institution, not a gallery of objects.",
    sense:
      "An institution that preserves and displays collections for study and public encounter. The Muses’ house becomes the house of artifacts.",
    note: "Music and museum share the Muses; one keeps their arts in time, the other often in space.",
  },
  {
    id: "collection",
    word: "collection",
    phonetic: "/kəˈlɛk.ʃən/",
    origin:
      "From Latin collectiō, from colligere “to gather together,” from com- “together” + legere “to gather, pick, read.” Related to elect, lecture, and elegant (choosing well).",
    sense:
      "Things gathered into one holding; the act of gathering; a liturgical prayer. Reading (legere) and collecting share the metaphor of picking out.",
    note: "A collector and a lector both select; one from objects, one from a text.",
  },
  {
    id: "curate",
    word: "curate",
    phonetic: "/ˈkjʊə.reɪt/ (verb); /ˈkjʊə.rət/ (noun)",
    origin:
      "From Latin cūrātus “one charged with the care of souls,” from cūra “care, concern.” The museum verb is a nineteenth–twentieth-century extension of pastoral care to objects and exhibitions.",
    sense:
      "As noun, an assistant clergy charged with care; as verb, to select, organize, and tend a collection or experience. Care is the constant.",
    note: "Cure, secure, and curiosity are Latin cūra’s wider family—care as remedy, safety, and desire to know.",
  },
  {
    id: "aesthetic",
    word: "aesthetic",
    phonetic: "/iːsˈθɛt.ɪk/",
    origin:
      "From German ästhetisch / New Latin aestheticus, coined in the eighteenth century from Greek αἰσθητικός (aisthētikós) “of sense-perception,” from αἰσθάνομαι (aisthánomai) “I perceive, feel.”",
    sense:
      "Concerned with perception of the beautiful or with art as sensory-cognitive experience. Baumgarten’s aesthetics named a science of sensitive knowing.",
    note: "Anesthetic is the negation: without sensation. The art-word and the medical word are literal opposites.",
  },
  {
    id: "beauty",
    word: "beauty",
    phonetic: "/ˈbjuː.ti/",
    origin:
      "From Old French beauté, from Latin bellus “pretty, handsome, agreeable” (a diminutive formation), not from classical pulcher. English beauty absorbs French courtly and aesthetic senses.",
    sense:
      "The quality that pleases in contemplation; a beautiful person or thing; fitness and radiance as judged by a culture’s eye. Distinct Latin lineages (bellum / pulchrum) feed related ideals.",
    note: "Belle, beau, and embellish keep the Latin bellus path; pulchritude preserves the older schoolbook Latin.",
  },
  {
    id: "sublime",
    word: "sublime",
    phonetic: "/səˈblaɪm/",
    origin:
      "From Latin sublīmis “uplifted, high, exalted,” possibly from sub- “up to” + līmen “threshold, lintel,” or from a root for sloping upward. The aesthetic sense is especially Longinian and Burkean/Kantian.",
    sense:
      "Lofty in style or feeling; that which overwhelms with magnitude, power, or elevation beyond ordinary beauty. Literally: raised to the lintel.",
    note: "Sublimate keeps the chemical and psychoanalytic “raising” of a substance or impulse.",
  },
  {
    id: "theory",
    word: "theory",
    phonetic: "/ˈθɪə.ri/",
    origin:
      "From Late Latin theōria, from Greek θεωρία (theōría) “contemplation, spectatorship, a looking at,” from θεωρός (theōrós) “spectator,” related to θέα (théa) “view” and θέατρον (théatron) “place for seeing.”",
    sense:
      "A coherent speculative account; in older usage, contemplative seeing as opposed to practice. Theory begins as sacred or civic spectatorship.",
    note: "Theater and theory are kin: both are organized forms of looking.",
  },
  {
    id: "practice",
    word: "practice",
    phonetic: "/ˈpræk.tɪs/",
    origin:
      "From Old French practiser, from Medieval Latin practicāre, from Greek πρακτικός (praktikós) “fit for action,” from πρᾶξις (prâxis) “action, deed,” from πρᾱ́σσω (prā́ssō) “I do.”",
    sense:
      "Repeated doing that forms skill; the application of knowledge; a professional’s work. Praxis is the philosophical twin emphasizing transformative action.",
    note: "Pragmatic and practical keep the Greek doing-root in English attitudes toward what works.",
  },
  {
    id: "technique",
    word: "technique",
    phonetic: "/tɛkˈniːk/",
    origin:
      "From French technique, from Greek τεχνικός (technikós) “of art,” from τέχνη (tékhnē) “art, craft, skill,” possibly from a root for woodworking or weaving as skilled making.",
    sense:
      "A methodical skill in making or performing; the how of an art. Technology is tékhnē plus λόγος—reasoned discourse about craft.",
    note: "In Greek, tékhnē covers both craft and art; the fine/applied split is later.",
  },
  {
    id: "technology",
    word: "technology",
    phonetic: "/tɛkˈnɒl.ə.dʒi/",
    origin:
      "From Greek τεχνολογία (tekhnología) “systematic treatment of an art,” from τέχνη (tékhnē) “craft” + -λογία (-logía) “account, study,” from λόγος (lógos). English adopts it for industrial arts in the nineteenth century.",
    sense:
      "The study or ensemble of practical arts and tools; now often the digital and industrial systems that remake everyday life. Etymologically: a logos of craft.",
    note: "Analogy’s λόγος and technology’s -logy are the same Greek word for reasoned account.",
  },
  {
    id: "system",
    word: "system",
    phonetic: "/ˈsɪs.təm/",
    origin:
      "From Late Latin systēma, from Greek σύστημα (sýstēma) “organized whole, composition,” from συνίστημι (sunístēmi) “I set together,” from σύν (sýn) “with” + ἵστημι (hístēmi) “I stand, set.”",
    sense:
      "A set of connected parts forming a complex unity—political, biological, conceptual, or technical. Standing-together is the image.",
    note: "Statue, static, and system share the Greek standing-root; one stands alone, one stands still, one stands with.",
  },
  {
    id: "structure",
    word: "structure",
    phonetic: "/ˈstrʌk.tʃər/",
    origin:
      "From Latin strūctūra “a fitting together, building,” from struere “to pile, arrange, build.” Related to destroy (de-struere), instruct, and construct.",
    sense:
      "The arrangement of parts in a whole; a built edifice; the abstract organization of a language or argument. Structure is building as relation.",
    note: "Infrastructure is the beneath-building; superstructure, the upon-building—Marxist and architectural at once.",
  },
  {
    id: "composition",
    word: "composition",
    phonetic: "/ˌkɒm.pəˈzɪʃ.ən/",
    origin:
      "From Latin compositiō, from compōnere “to put together,” from com- “together” + pōnere “to place.” Related to position, positive, and component.",
    sense:
      "A putting-together of elements—musical, pictorial, chemical, or prose. Also the school exercise and the typesetter’s trade. Placement in relation is the core.",
    note: "Compose yourself and compose a page both mean arrange parts into a stable whole.",
  },
  {
    id: "context",
    word: "context",
    phonetic: "/ˈkɒn.tɛkst/",
    origin:
      "From Latin contextus “a weaving together,” from contexere “to weave together,” from com- “together” + texere “to weave.” Related to text, textile, and texture.",
    sense:
      "The surrounding discourse or situation that constrains meaning; that which is woven with the focal strand. Words mean with their weave.",
    note: "A text is already a woven thing (texere); context is the larger cloth.",
  },
  {
    id: "text",
    word: "text",
    phonetic: "/tɛkst/",
    origin:
      "From Latin textus “woven fabric, style, tissue of a work,” from texere “to weave.” The manuscript sense generalizes from the weave of words.",
    sense:
      "Written or spoken words as an artifact to be read; the main body of a work as opposed to notes. Reading as following a weave.",
    note: "Hypertext names an exceeding of the linear weave—links as new warp and weft.",
  },
];
