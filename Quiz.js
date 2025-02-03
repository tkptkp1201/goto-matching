import React, { useState, useEffect } from "react";
import { database } from "./firebase";

const questions = [
  "五島市の人口減少対策として移住促進を強化すべきか？",
  "観光産業を市の主要な経済基盤とすべきか？",
  "公共交通の改善に予算をもっと投入すべきか？",
  "地域の医療体制を強化するために市の支援を増やすべきか？",
  "教育環境の向上のためにデジタル化を推進すべきか？",
  "農業・漁業の振興を市がより積極的に支援すべきか？",
  "市の財政負担を減らすために公共サービスを見直すべきか？",
  "高齢者福祉を優先して予算配分すべきか？",
  "子育て支援制度の拡充が必要か？",
  "再生可能エネルギーの導入を進めるべきか？",
  "観光業への補助金を増やすべきか？",
  "五島市のインフラ整備（道路、港湾など）を優先すべきか？",
  "議会の透明性を高めるために市民参加の機会を増やすべきか？",
  "税負担を減らすために市の運営コストを削減すべきか？",
  "五島市のブランディングを強化し、全国にPRすべきか？"
];

const candidates = [
  { name: "候補者A", answers: [1, 1, 0, 1, -1, 1, 0, 1, 1, 1, 0, 1, 1, -1, 1], policyLink: "https://example.com/a" },
  { name: "候補者B", answers: [-1, 0, 1, -1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, -1], policyLink: "https://example.com/b" },
  { name: "候補者C", answers: [0, 1, -1, 1, 0, -1, 1, 0, 1, -1, 1, 0, 1, 1, 1], policyLink: "https://example.com/c" }
];

const Quiz = () => {
  const [responses, setResponses] = useState(Array(15).fill(0));
  const [matchedCandidate, setMatchedCandidate] = useState(null);

  useEffect(() => {
    database.ref("candidates").once("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Updated candidate data", data);
      }
    });
  }, []);

  const handleAnswer = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const calculateMatch = () => {
    let bestMatch = null;
    let bestScore = -Infinity;

    candidates.forEach(candidate => {
      let score = candidate.answers.reduce((sum, ans, i) => sum + (ans === responses[i] ? 1 : 0), 0);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = candidate;
      }
    });

    setMatchedCandidate(bestMatch);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">五島市議会議員選挙マッチング</h1>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <p className="mb-2">{question}</p>
          <button onClick={() => handleAnswer(index, 1)} className="mr-2 p-2 bg-green-500 text-white rounded">賛成</button>
          <button onClick={() => handleAnswer(index, 0)} className="mr-2 p-2 bg-gray-500 text-white rounded">どちらでもない</button>
          <button onClick={() => handleAnswer(index, -1)} className="p-2 bg-red-500 text-white rounded">反対</button>
        </div>
      ))}
      <button onClick={calculateMatch} className="mt-4 p-2 bg-blue-500 text-white rounded">結果を見る</button>
      {matchedCandidate && (
        <div className="mt-4 text-xl font-bold">
          あなたに最もマッチする候補者は: {matchedCandidate.name}
          <br/>
          <a href={matchedCandidate.policyLink} target="_blank" className="text-blue-600 underline">候補者の政策を見る</a>
        </div>
      )}
    </div>
  );
};

export default Quiz;
