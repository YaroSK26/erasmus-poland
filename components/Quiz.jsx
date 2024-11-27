"use client";
import { useState, useEffect } from "react"; // odstránili sme useRef
import { motion } from "framer-motion"; // odstránili sme useInView
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import questions from "../public/questions.json";

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Quiz() {
  const [translations, setTranslations] = useState({
    quiz_title: "Kvíz o umelej inteligencii",
    quiz_end: "Kvíz ukončený",
    score: "Skóre:",
    out_of: "z",
    start_again: "Začať znova",
    show_results: "Zobraziť výsledky",
    next_question: "Ďalšia otázka",
  });

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [language, setLanguage] = useState("sk");

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const storedLanguage = localStorage.getItem("language") || "sk";
        setLanguage(storedLanguage);
        const module = await import(`../public/locales/${storedLanguage}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.error("Error loading translations:", error);
      }
    };

    loadTranslations();
    setShuffledQuestions(shuffleArray(questions));
  }, []);

  const handleAnswer = (answer) => {
    if (answer === shuffledQuestions[currentQuestion].correctAnswer[language]) {
      setScore(score + 1);
    }
    setSelectedAnswer(answer);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setShuffledQuestions(shuffleArray(questions));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  if (shuffledQuestions.length === 0) {
    return null;
  }

  const { question, answers } = shuffledQuestions[currentQuestion];
  const progressPercentage =
    ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  return (
    <section className="py-16 px-4 bg-[#F6FAFF] min-h-screen flex items-center justify-center">
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible" // Zmenili sme toto z podmienky na priame "visible"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-blue-800">
              {translations.quiz_title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showResult ? (
              <>
                <Progress value={progressPercentage} className="mb-6" />
                <p className="text-lg md:text-xl mb-6 text-center">
                  {question[language]}
                </p>
                <div className="space-y-4">
                  {answers.map((answer, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.3, delay: index * 0.1 },
                        },
                      }}
                    >
                      <Button
                        variant={
                          selectedAnswer === answer.text[language]
                            ? answer.correct
                              ? "success"
                              : "destructive"
                            : "outline"
                        }
                        className="w-full justify-start text-left py-6 px-4 text-base md:text-lg"
                        onClick={() => handleAnswer(answer.text[language])}
                        disabled={selectedAnswer !== null}
                      >
                        {selectedAnswer === answer.text[language] &&
                          (answer.correct ? (
                            <CheckCircle className="mr-2 h-5 w-5" />
                          ) : (
                            <XCircle className="mr-2 h-5 w-5" />
                          ))}
                        {answer.text[language]}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                className="text-center"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.5 },
                  },
                }}
              >
                <h3 className="text-2xl font-bold mb-4">
                  {translations.quiz_end}
                </h3>
                <p className="text-xl mb-6">
                  {translations.score} {score} {translations.out_of}{" "}
                  {shuffledQuestions.length}
                </p>
                <Button onClick={restartQuiz} size="lg">
                  {translations.start_again}
                </Button>
              </motion.div>
            )}
          </CardContent>
          {selectedAnswer && !showResult && (
            <CardFooter className="justify-center">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3 },
                  },
                }}
              >
                <Button onClick={nextQuestion} size="lg">
                  {currentQuestion === shuffledQuestions.length - 1
                    ? translations.show_results
                    : translations.next_question}
                </Button>
              </motion.div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </section>
  );
}
