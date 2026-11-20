(() => {
  const characters = {
    seraphine: {
      name: "Lady Seraphine Vale", title: "Royal Advisor", role: "ADVISOR", mark: "✦",
      sprite: "#566f70", hair: "#2a2024", skin: "#d7ad84", accent: "#d6bd86", x: 0.22, y: 0.79,
      temperament: "measured", greeting: "Your Grace. A realm is not ruled by decrees alone. It is ruled by what people believe those decrees mean.",
      topics: [
        { label: "What should I watch for?", line: "Listen for the fear beneath a petition. A request for coin may really be a request to be seen. And a quiet court is not always a content one." },
        { label: "Tell me about the court", line: "Aldric trusts a clear order. Elowen trusts a balanced ledger. I trust neither certainty nor silence; both can hide a crack in the realm." },
        { label: "I value your counsel", line: "Then I will spend it carefully, Your Grace. Counsel is not command—and the final weight belongs to the crown.", affinity: 1 }
      ]
    },
    aldric: {
      name: "Captain Aldric Thorne", title: "Commander of the Guard", role: "COMMANDER", mark: "⚔",
      sprite: "#536277", hair: "#352a24", skin: "#c89470", accent: "#caa45f", x: 0.77, y: 0.79,
      temperament: "direct", greeting: "Your Majesty. Three caravans have failed to arrive from the eastern road. The merchants want an answer before dusk.",
      petition: {
        id: "eastern-road",
        text: "Three caravans have vanished on the eastern road. Merchants are already talking of taking the northern pass. I can spare riders—but every patrol leaves another post thin.",
        choices: [
          { label: "Send a full patrol · −25 gold", effects: { gold: -25, stability: 7, approval: 2 }, reply: "Aldric strikes his fist to his chest. 'I will take the road myself. The merchants will see our colors before nightfall.'" },
          { label: "Send a small scout · −10 gold", effects: { gold: -10, stability: 3 }, reply: "'A lighter hand, then.' Aldric marks a route on the map. The road will have eyes, though not a shield." },
          { label: "Gather evidence first", effects: { stability: 1 }, reply: "Aldric weighs the order, then nods. 'I will question the last drivers. Better a true trail than a blind charge.'" },
          { label: "The road must wait", effects: { stability: -4, approval: -2 }, reply: "His jaw tightens. 'As you command.' The merchants' wagons turn north before the week is out." }
        ]
      },
      topics: [{ label: "Ask about the guard", line: "The gate watch is steady, but the eastern road is not. Give a soldier a purpose and a fair wage; do not ask him to be brave on an empty stomach." }]
    },
    elowen: {
      name: "Mistress Elowen Reed", title: "Royal Treasurer", role: "TREASURER", mark: "◈",
      sprite: "#766047", hair: "#a56d45", skin: "#e0ba91", accent: "#c4a060", x: 0.48, y: 0.79,
      temperament: "wry", greeting: "Your Grace, the treasury is modest, not empty. That distinction is the only reason I slept last night.",
      topics: [
        { label: "How stands the treasury?", line: "One hundred gold in reserve, and eighty days' rations in the stores. Enough to act—but not enough to act carelessly." },
        { label: "What would you fund first?", line: "Repair the eastern road if Aldric confirms the danger. A road earns its keep twice: once in trade, and again when help must arrive quickly." },
        { label: "I will keep the books honestly", line: "A refreshing royal policy. I shall try not to faint from the novelty.", affinity: 1 }
      ]
    },
    mara: {
      name: "Mara Fen", title: "Farmer from Eastmere", role: "PETITIONER", mark: "❋",
      sprite: "#718051", hair: "#79533b", skin: "#d4a27b", accent: "#d6bd86", x: 0.92, y: 0.79,
      temperament: "earnest", greeting: "Your Grace, please—Eastmere's barley failed after the late frost. My neighbors can pay the tax or feed their children, but not both.",
      petition: {
        id: "eastmere-harvest",
        text: "The late frost took most of Eastmere's barley. The tax collector comes in three days. I am not asking the crown to fill every barn—only to give us a little room to sow again.",
        choices: [
          { label: "Grant tax relief · −12 gold", effects: { gold: -12, approval: 7, stability: 2 }, reply: "Mara bows, shoulders easing. 'We can buy seed with the time you have given us. Eastmere will remember this come harvest.'" },
          { label: "Release grain · −18 rations", effects: { food: -18, approval: 5, stability: 1 }, reply: "'The children will eat tonight.' Mara presses a hand to her heart. The royal stores grow lighter, but the village has a chance to sow." },
          { label: "Hold the tax line", effects: { gold: 8, approval: -7, stability: -3 }, reply: "Mara's voice goes quiet. 'Then we will pay what we can.' The treasury gains coin; Eastmere's seed money does not." }
        ]
      },
      topics: [{ label: "Ask how Eastmere is faring", line: "The fields are still green at the edges, Your Grace. A village can survive a bad season. It is the season after that which frightens us." }]
    },
    brann: {
      name: "Sir Brann Holt", title: "Captain of the Royal Guard", role: "ROYAL GUARD", mark: "♜",
      sprite: "#65524a", hair: "#302820", skin: "#bd8e70", accent: "#aa8e65", x: 0.09, y: 0.79,
      temperament: "watchful", greeting: "All doors are watched, Your Grace. The important question is what we choose to let through them.",
      topics: [{ label: "Is the palace secure?", line: "Secure enough for honest conversation. No wall can keep out a poor decision, though. I have tried explaining that to the masons." }]
    }
  };

  window.GAME_CONTENT = { characters };
})();
