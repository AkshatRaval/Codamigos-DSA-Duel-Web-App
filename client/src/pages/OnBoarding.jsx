import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import AvatarSelector from "../components/AvatarSelector";
import { useSelector } from "react-redux";
import { useAuth } from "../lib/AuthProvider";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react"; // Ensure you have this installed
import { doc, serverTimestamp, runTransaction, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { ArrowRight, ArrowLeft, Check, Github, Linkedin, Globe, Code } from "lucide-react";
import { useNotifications } from "../utils/useNotifications";

const OnBoarding = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const avatars = Array.from({ length: 33 }, (_, i) => `/avatars/avatar${i}.png`);
  const avatarIndex = useSelector((state) => state.avatarIndex.value);

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    displayName: "",
    userHandle: "",
    bio: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    leetcode: "",
    codeforces: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!currentUser) return;
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        navigate("/");
      }
    };
    checkProfile();
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const normalizeHandle = (h) => h.trim().replace(/^@+/, "").toLowerCase();
  const { sendNotification } = useNotifications()
  const nextStep = () => {
    if (step === 1) {
      if (!formData.displayName.trim() || !formData.userHandle.trim() || !formData.bio.trim()) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (formData.userHandle.length < 3) {
        toast.error("Handle must be at least 3 characters.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!currentUser) return;
    setLoading(true);

    const rawHandle = formData.userHandle.trim();
    const handleLower = normalizeHandle(rawHandle);

    const avatarPath = avatars[avatarIndex];
    const avatarFile = avatarPath.split("/").pop();

    try {
      const handleRef = doc(db, "handles", handleLower);
      const userRef = doc(db, "users", currentUser.uid);

      await runTransaction(db, async (tx) => {
        const handleSnap = await tx.get(handleRef);
        if (handleSnap.exists()) {
          throw new Error("This handle is already taken");
        }

        tx.set(handleRef, {
          uid: currentUser.uid,
          createdAt: serverTimestamp(),
        });

        tx.set(userRef, {
          uid: currentUser.uid,
          displayName: formData.displayName.trim(),
          userHandle: rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`,
          handleLower,
          avatarUrl: avatarFile,
          bio: formData.bio.trim(),
          role: "user",
          friends: [],
          incomingFriendReq: [],
          outgoingFriendReq: [],
          unreadNotificationCount: 0,
          createdAt: serverTimestamp(),
          elo: 400,
          wins: 0,
          losses: 0,
          streak: { current: 0, best: 0, lastActivityDate: serverTimestamp() },
          coins: 0, 
          solvedProblems: { total: 0, easy: 0, medium: 0, hard: 0 },
          socials: {
            github: formData.github.trim(),
            linkedin: formData.linkedin.trim(),
            twitter: formData.twitter.trim(),
            website: formData.website.trim(),
          },
          codingProfiles: {
            leetcode: formData.leetcode.trim(),
            codeforces: formData.codeforces.trim(),
          }
        });
      });

      toast.success("Welcome to Codamigos!");
      sendNotification(currentUser.uid, "We are glad to have you on Codamigos.", "welcome")
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.message === "This handle is already taken") {
        toast.error("Handle taken! Please choose another.");
        setStep(1);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER STEPS ---
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">Who are you?</h2>
              <AvatarSelector avatars={avatars} />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Display Name <span className="text-red-500">*</span></Label>
                <Input
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="e.g. Code Master"
                />
              </div>
              <div className="space-y-2">
                <Label>Unique Handle <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                  <Input
                    name="userHandle"
                    value={formData.userHandle}
                    onChange={handleChange}
                    className="pl-8"
                    placeholder="codemaster99"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio <span className="text-red-500">*</span></Label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="I love dynamic programming..."
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold">Where can we find you?</h2>
              <p className="text-sm text-muted-foreground">Connect your social networks (Optional)</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Github size={16} /> GitHub</Label>
                <Input
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Linkedin size={16} /> LinkedIn</Label>
                <Input
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Globe size={16} /> Portfolio Website</Label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://myportfolio.com"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold">Show off your stats</h2>
              <p className="text-sm text-muted-foreground">Link your coding profiles (Optional)</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Code size={16} /> LeetCode Profile</Label>
                <Input
                  name="leetcode"
                  value={formData.leetcode}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/u/username"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Code size={16} /> CodeForces Profile</Label>
                <Input
                  name="codeforces"
                  value={formData.codeforces}
                  onChange={handleChange}
                  placeholder="https://codeforces.com/profile/username"
                />
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute bottom-50 left-20 w-72 h-72 bg-yellow-500 rounded-full blur-[120px] -z-1 opacity-20" />
      <div className="absolute top-10 right-20 w-80 h-50 bg-yellow-400 rounded-full blur-[150px] -z-1 opacity-20" />

      <Card className="w-full absolute max-w-xl shadow-2xl bg-card/95 backdrop-blur top-20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Welcome to DSA Dual!</CardTitle>
              <CardDescription>Step {step} of {totalSteps}</CardDescription>
            </div>
            {/* Simple Progress Bar */}
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-2 w-8 rounded-full transition-all ${step >= s ? "bg-primary" : "bg-primary/20"}`} />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between w-full border-t pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1 || loading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {step < totalSteps ? (
            <Button onClick={nextStep}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Finish Profile"} <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </section>
  );
};

export default OnBoarding;