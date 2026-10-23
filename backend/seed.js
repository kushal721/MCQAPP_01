// Loads sample courses, subjects and questions.
// Usage: npm run seed            (only seeds an empty database)
//        npm run seed -- --fresh (wipes existing data first)
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/course");
const Subject = require("./models/subject");
const Question = require("./models/question");
const QuestionAttempt = require("./models/questionAttempt");

dotenv.config();
const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/MCQ";

// [question, [options], index of correct option, explanation]
const data = [
  {
    name: "IOE",
    courseDescription:
      "Institute of Engineering entrance preparation: physics, chemistry and mathematics.",
    subjects: {
      Physics: [
        ["What is the SI unit of force?", ["Joule", "Newton", "Watt", "Pascal"], 1, "1 newton is the force that accelerates 1 kg at 1 m/s²."],
        ["Kinetic energy of a body of mass m moving with velocity v is:", ["mv", "½mv²", "mv²", "2mv²"], 1, "KE = ½mv², derived from the work done to accelerate the body from rest."],
        ["Which quantity is a vector?", ["Speed", "Mass", "Displacement", "Temperature"], 2, "Displacement has both magnitude and direction."],
        ["The acceleration due to gravity on Earth's surface is approximately:", ["4.9 m/s²", "9.8 m/s²", "19.6 m/s²", "1.6 m/s²"], 1, "g ≈ 9.8 m/s² near the Earth's surface."],
      ],
      Chemistry: [
        ["What is the atomic number of carbon?", ["4", "6", "8", "12"], 1, "Carbon has 6 protons."],
        ["pH of a neutral solution at 25 °C is:", ["0", "1", "7", "14"], 2, "At 25 °C, [H⁺] = 10⁻⁷ M in pure water, so pH = 7."],
        ["Which gas is produced when zinc reacts with dilute HCl?", ["Oxygen", "Chlorine", "Hydrogen", "Nitrogen"], 2, "Zn + 2HCl → ZnCl₂ + H₂."],
      ],
      Mathematics: [
        ["The derivative of sin x is:", ["cos x", "−cos x", "tan x", "−sin x"], 0, "d/dx (sin x) = cos x."],
        ["What is the value of log₁₀ 1000?", ["2", "3", "10", "100"], 1, "10³ = 1000."],
        ["The sum of the interior angles of a triangle is:", ["90°", "180°", "270°", "360°"], 1, "Angles in any Euclidean triangle add up to 180°."],
      ],
    },
  },
  {
    name: "IOM",
    courseDescription:
      "Institute of Medicine entrance preparation: biology, chemistry and physics.",
    subjects: {
      Biology: [
        ["The powerhouse of the cell is the:", ["Nucleus", "Ribosome", "Mitochondrion", "Golgi body"], 2, "Mitochondria produce most of the cell's ATP."],
        ["Which blood cells help in clotting?", ["RBCs", "WBCs", "Platelets", "Plasma cells"], 2, "Platelets (thrombocytes) form clots at injury sites."],
        ["DNA replication is:", ["Conservative", "Semi-conservative", "Dispersive", "Non-conservative"], 1, "Each new DNA molecule keeps one original strand (the Meselson and Stahl experiment)."],
      ],
      Chemistry: [
        ["Which of these is a noble gas?", ["Nitrogen", "Argon", "Oxygen", "Hydrogen"], 1, "Argon is in group 18."],
        ["Avogadro's number is approximately:", ["6.022 × 10²³", "3.0 × 10⁸", "9.81", "1.6 × 10⁻¹⁹"], 0, "One mole contains 6.022 × 10²³ particles."],
      ],
    },
  },
  {
    name: "Loksewa",
    courseDescription:
      "Public Service Commission preparation: general knowledge and current affairs.",
    subjects: {
      "General Knowledge": [
        ["What is the highest peak in the world?", ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"], 2, "Mount Everest stands at 8,848.86 m."],
        ["How many provinces does Nepal have?", ["5", "6", "7", "8"], 2, "The 2015 constitution created seven provinces."],
        ["Which is the longest river in Nepal?", ["Koshi", "Karnali", "Gandaki", "Bagmati"], 1, "The Karnali is Nepal's longest river."],
      ],
    },
  },
];

const seed = async () => {
  await mongoose.connect(DATABASE_URL);
  const fresh = process.argv.includes("--fresh");

  if (fresh) {
    await Promise.all([
      Course.deleteMany({}),
      Subject.deleteMany({}),
      Question.deleteMany({}),
      QuestionAttempt.deleteMany({}),
    ]);
    console.log("Cleared existing data.");
  } else if (await Course.exists({})) {
    console.log(
      "Database already has courses. Run `npm run seed -- --fresh` to wipe and reseed."
    );
    return;
  }

  await Subject.syncIndexes();

  let questionCount = 0;
  for (const { subjects, ...course } of data) {
    const newCourse = await Course.create(course);
    for (const [name, questions] of Object.entries(subjects)) {
      const subject = await Subject.create({ name, courseId: newCourse._id });
      await Question.insertMany(
        questions.map(([question_text, options, correct, explanation]) => ({
          subject_id: subject._id,
          question_text,
          options: options.map((option_text, i) => ({
            option_text,
            is_correct: i === correct,
          })),
          explanation,
        }))
      );
      questionCount += questions.length;
    }
  }

  console.log(`Seeded ${data.length} courses and ${questionCount} questions.`);
};

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
