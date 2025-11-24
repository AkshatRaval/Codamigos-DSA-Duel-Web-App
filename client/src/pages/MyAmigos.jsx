import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Bell,
  UserPlus,
  Search,
  Sword,
  MessageCircle,
  X,
  Eye,
  Trophy,
  Copy,
  Filter,
  ArrowLeft,
  User,
  UserRoundX
} from "lucide-react";
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthProvider"
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  documentId,
  orderBy,
  limit,
  arrayRemove,
  arrayUnion,
  updateDoc
} from "firebase/firestore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../components/ui/context-menu"
// --- UTILITY: Calculate Rank based on ELO ---
const getRankFromElo = (elo) => {
  if (elo < 1200) return "Bronze";
  if (elo < 1400) return "Silver";
  if (elo < 1600) return "Gold";
  if (elo < 1800) return "Platinum";
  return "Diamond";
};

// --- UTILITY: Efficiently Fetch Users by ID Chunks ---
// Firestore 'in' queries are limited to 10 items. This handles large lists.
const fetchUserProfiles = async (uids) => {
  if (!uids || uids.length === 0) return [];

  const uniqueUids = [...new Set(uids)]; // Remove duplicates
  const chunks = [];
  const chunkSize = 10;

  for (let i = 0; i < uniqueUids.length; i += chunkSize) {
    chunks.push(uniqueUids.slice(i, i + chunkSize));
  }

  try {
    const promises = chunks.map(async (chunk) => {
      const q = query(collection(db, "users"), where("uid", "in", chunk));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.uid,
          name: data.displayName || "Unknown",
          handle: data.userHandle || "@unknown",
          avatarUrl: data.avatarUrl,
          // Map DB fields to UI fields
          tagline: data.bio || "No bio yet.",
          elo: data.elo || 0,
          rank: getRankFromElo(data.elo || 0),
          wins: data.wins || 0,
          losses: data.losses || 0,
          languages: ["JavaScript"], // Default as it's not in DB schema provided
          // Firestore doesn't have native "online" status without Realtime DB presence
          // We default to false or check lastActive if you have that field
          status: "Offline",
          online: false,
          mutual: 0 // Calculation would require checking friends of friends
        };
      });
    });

    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
};

const FriendsPage = () => {
  const { userData } = useAuth()
  const navigate = useNavigate()

  // State for Data
  const [friendsList, setFriendsList] = useState([]);
  const [incomingReqs, setIncomingReqs] = useState([]);
  const [outgoingReqs, setOutgoingReqs] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]); // For "Add Friend" tab

  // State for UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("friends");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("elo");
  const [selectedFriend, setSelectedFriend] = useState(null);

  // 1. Fetch Friends, Requests, and Outgoing
  useEffect(() => {
    const loadSocialData = async () => {
      if (!userData) return;
      setLoading(true);

      // Parallel fetch for efficiency
      const [friendsData, incomingData, outgoingData] = await Promise.all([
        fetchUserProfiles(userData.friends || []),
        fetchUserProfiles(userData.incomingFriendReq || []),
        fetchUserProfiles(userData.outgoingFriendReq || [])
      ]);

      setFriendsList(friendsData);
      setIncomingReqs(incomingData);
      setOutgoingReqs(outgoingData);
      setLoading(false);
    };

    loadSocialData();
  }, [userData]);

  useEffect(() => {
    if (activeTab === 'add') {
      const fetchTopPlayers = async () => {
        try {
          // Fetch top 20 players by ELO
          const q = query(collection(db, "users"), orderBy("elo", "desc"), limit(20));
          const snapshot = await getDocs(q);
          const users = snapshot.docs
            .map(doc => {
              const data = doc.data();
              // Filter out self and existing friends
              if (data.uid === userData?.uid) return null;
              if (userData?.friends?.includes(data.uid)) return null;

              return {
                id: doc.id,
                avatarUrl: data.avatarUrl,
                name: data.displayName,
                handle: data.userHandle,
                elo: data.elo,
                mutual: 0
              };
            })
            .filter(u => u !== null);

          setDiscoverUsers(users);
        } catch (e) {
          console.error("Error fetching top players", e);
        }
      };
      fetchTopPlayers();
    }
  }, [activeTab, userData]);

  const handleInvite = (friend, e) => {
    e.stopPropagation();
    alert(`Invite sent to ${friend.name}`);
  };

  const handleSpectate = (friend, e) => {
    e.stopPropagation();
    alert(`Spectating ${friend.name}'s duel!`);
  };

  const handleMessage = (friend, e) => {
    e.stopPropagation();
    alert(`Opening chat with ${friend.name}`);
  };

  // ================== Handle Functions ================== //
  const handleAccept = async (req) => {
    if (!userData || !req.id) return;
    try {
      setLoading(true);
      const myUid = userData.uid;
      const friendUid = req.id;
      const myDocRef = doc(db, "users", myUid);
      const friendDocRef = doc(db, "users", friendUid);
      await Promise.all([
        updateDoc(myDocRef, {
          incomingFriendReq: arrayRemove(friendUid),
          friends: arrayUnion(friendUid)
        }),
        updateDoc(friendDocRef, {
          outgoingFriendReq: arrayRemove(myUid),
          friends: arrayUnion(myUid)
        })
      ]);
      alert(`You are now friends with ${req.name}!`);
      setIncomingReqs(prev => prev.filter(r => r.id !== friendUid));
      setFriendsList(prev => [...prev, { ...req, status: "Offline" }]);

    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleIgnore = async (req) => {
    if (!userData || !req.id) return;
    try {
      setLoading(true);
      const myUid = userData.uid;
      const friendUid = req.id;
      const myDocRef = doc(db, "users", myUid);
      const friendDocRef = doc(db, "users", friendUid);
      await Promise.all([
        updateDoc(myDocRef, {
          incomingFriendReq: arrayRemove(friendUid),
        }),
        updateDoc(friendDocRef, {
          outgoingFriendReq: arrayRemove(myUid),
        })
      ]);
      alert(`You Ignored ${req.name}!`);
      setIncomingReqs(prev => prev.filter(r => r.id !== friendUid));
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (req) => {
    if (!userData || !req.id) return;
    try {
      setLoading(true);
      const myUid = userData.uid;
      const friendUid = req.id;
      const myDocRef = doc(db, "users", myUid);
      const friendDocRef = doc(db, "users", friendUid);
      await Promise.all([
        updateDoc(myDocRef, {
          outgoingFriendReq: arrayRemove(friendUid),
        }),
        updateDoc(friendDocRef, {
          incomingFriendReq: arrayRemove(myUid),
        })
      ]);
      alert(`You are now friends with ${req.name}!`);
      setIncomingReqs(prev => prev.filter(r => r.id !== friendUid));
      setFriendsList(prev => [...prev, { ...req, status: "Offline" }]);

    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (req) => {
    if (!userData || !req.id) return;
    try {
      setLoading(true);
      const myUid = userData.uid;
      const friendUid = req.id;
      const myDocRef = doc(db, "users", myUid);
      const friendDocRef = doc(db, "users", friendUid);
      await Promise.all([
        updateDoc(myDocRef, {
          outgoingFriendReq: arrayUnion(friendUid),
        }),
        updateDoc(friendDocRef, {
          incomingFriendReq: arrayUnion(myUid),
        })
      ]);
      alert(`You are now friends with ${req.name}!`);
      setIncomingReqs(prev => prev.filter(r => r.id !== friendUid));
      setFriendsList(prev => [...prev, { ...req, status: "Offline" }]);

    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredFriends = useMemo(() => {
    let list = [...friendsList];
    if (filter === "online") list = list.filter((f) => f.online);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        f.handle.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'elo') return b.elo - a.elo;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [friendsList, search, filter, sortBy]);

  const [filteredIncoming, filteredOutgoing] = useMemo(() => {
    if (!search.trim()) return [incomingReqs, outgoingReqs];
    const q = search.toLowerCase();
    return [
      incomingReqs.filter((x) => x.name.toLowerCase().includes(q)),
      outgoingReqs.filter((x) => x.name.toLowerCase().includes(q)),
    ];
  }, [incomingReqs, outgoingReqs, search]);

  const addResults = useMemo(() => {
    if (!search.trim()) return discoverUsers;
    const q = search.toLowerCase();
    return discoverUsers.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      u.handle?.toLowerCase().includes(q)
    );
  }, [discoverUsers, search]);

  const clearSearch = () => setSearch("");

  return (
    // Forced dark mode wrapper
    <div className="min-h-screen w-full flex bg-background text-zinc-50 font-sans dark">

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-background">
        <div className="p-6">
          <Button variant="outline" className="w-full" onClick={() => navigate('/')}><ArrowLeft /> Back To Home</Button>
        </div>
        <Separator />
        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarItem
            icon={Users}
            label="Friends"
            active={activeTab === "friends"}
            onClick={() => setActiveTab("friends")}
          />
          <SidebarItem
            icon={Bell}
            label="Requests"
            active={activeTab === "requests"}
            onClick={() => setActiveTab("requests")}
            badge={filteredIncoming.length}
          />
          <SidebarItem
            icon={UserPlus}
            label="Add Friend"
            active={activeTab === "add"}
            onClick={() => setActiveTab("add")}
          />
        </nav>

        {/* User Stats */}
        <div className="p-4 border-t border-zinc-800">
          <div className="rounded-lg bg-background p-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase">Your Rank</div>
            <div className="font-bold text-zinc-50 flex items-center gap-2 mt-1">
              <Trophy className="h-4 w-4 text-amber-500" /> {getRankFromElo(userData?.elo || 0)}
            </div>
            <div className="text-xs text-zinc-400 mt-1">{userData?.elo || 0} ELO</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        {/* Header */}
        <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-4 justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
              {activeTab === "friends" && "Friends"}
              {activeTab === "requests" && "Requests"}
              {activeTab === "add" && "Discover"}
            </h1>
            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] uppercase tracking-wider">
              Beta
            </Badge>
          </div>

          <div className="flex items-center gap-3 max-w-md w-full justify-end">
            <div className="relative flex-1 max-w-xs">
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder={activeTab === 'add' ? "Find users..." : "Search friends..."}
                className="pl-9 pr-8 h-9 bg-background/50 focus:bg-background border-transparent focus:border-zinc-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-background text-zinc-500"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {activeTab === "friends" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortBy(sortBy === 'elo' ? 'name' : 'elo')}
                  className="h-9 gap-2 hidden sm:flex"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>{sortBy === 'elo' ? 'ELO' : 'Name'}</span>
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Body */}
        <section className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
          {activeTab === "friends" && (
            <FriendsList
              friends={filteredFriends}
              search={search}
              filter={filter}
              setFilter={setFilter}
              onInvite={handleInvite}
              onSpectate={handleSpectate}
              onMessage={handleMessage}
              onSelect={setSelectedFriend}
              loading={loading}
            />
          )}
          {activeTab === "requests" && (
            <RequestsView
              incoming={filteredIncoming}
              outgoing={filteredOutgoing}
              search={search}
              onAccept={handleAccept}
              onIgnore={handleIgnore}
              onCancel={handleCancel}
            />
          )}
          {activeTab === "add" && (
            <AddFriendsView results={addResults} onAdd={handleAddFriend} />
          )}
        </section>
      </main>

      {/* Modal */}
      {selectedFriend && (
        <UserProfileModal
          user={selectedFriend}
          onClose={() => setSelectedFriend(null)}
          onInvite={(e) => handleInvite(selectedFriend, e)}
        />
      )}
    </div>
  );
};

/* ---------- Sidebar item ---------- */

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all duration-200 mb-1 font-medium
      ${active
        ? "bg-background text-zinc-50"
        : "text-zinc-400 hover:bg-background hover:text-zinc-50"
      }
    `}
  >
    <div className="flex items-center gap-3">
      <Icon className={`h-4 w-4 ${active ? "text-zinc-50" : "text-zinc-500"}`} />
      <span>{label}</span>
    </div>
    {badge > 0 && (
      <Badge>
        {badge}
      </Badge>
    )}
  </button>
);

/* ---------- Friends list view ---------- */

const FriendsList = ({ friends, search, filter, setFilter, onInvite, onSpectate, onMessage, onSelect, loading }) => {
  const hasSearch = !!search.trim();

  return (
    <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
      <div className="flex items-center justify-between pb-4">
        <Tabs className="flex items-center gap-2 p-1 bg-background rounded-lg w-fit" defaultValue="all">
          <TabsList>
            <TabsTrigger
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === 'all' ? 'bg-background text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'}`}
              value="all"
              onClick={() => setFilter('all')}
            >
              All
            </TabsTrigger>
            <TabsTrigger
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${filter === 'online' ? 'bg-background text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'}`}
              value="online"
              onClick={() => setFilter('online')}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${filter === 'online' ? 'bg-emerald-500' : 'bg-background'}`} />
              Online
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="text-xs text-zinc-400">
          {friends?.length} {friends?.length === 1 ? "friend" : "friends"}
        </span>
      </div>

      <CardContent className="p-0 flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-background shadow-sm">
        {loading ? (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">Loading friends...</div>
        ) : friends?.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-sm text-zinc-400 text-center p-8">
            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-zinc-600" />
            </div>
            <p className="font-medium text-zinc-50">No friends found</p>
            <p className="max-w-[200px] mt-1 text-xs">
              {hasSearch ? "Try a different search term." : "Add friends to start dueling!"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="divide-y divide-zinc-900">
              {friends.map((friend) => (
                <FriendRow
                  key={friend?.id}
                  friend={friend}
                  onInvite={onInvite}
                  onSpectate={onSpectate}
                  onMessage={onMessage}
                  onSelect={() => onSelect(friend)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

const FriendRow = ({ friend, onInvite, onSpectate, onMessage, onSelect }) => {
  const isDueling = friend.status === "In a Duel";
  // Note: Since Firestore doesn't provide Realtime Online status easily, 
  // this defaults to offline unless you implement a presence system.
  const statusColor =
    friend?.online
      ? "bg-emerald-500"
      : isDueling
        ? "bg-amber-400"
        : "bg-zinc-600"; // Grey for offline

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={onSelect}
          className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors cursor-pointer group"
        >

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar>
                <AvatarImage src={`/avatars/${friend?.avatarUrl}`} />
                <AvatarFallback>{friend?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-950 ${statusColor}`} />
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium leading-none text-zinc-100 group-hover:text-zinc-300">
                  {friend?.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border font-medium uppercase tracking-wide
                ${friend.rank === 'Gold' ? 'bg-amber-900/20 text-amber-400 border-amber-900/50' :
                    friend.rank === 'Diamond' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-900/50' :
                      friend.rank === 'Platinum' ? 'bg-cyan-900/20 text-cyan-400 border-cyan-900/50' :
                        'bg-background text-zinc-400 border-zinc-700'
                  }
            `}>
                  {friend?.rank}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 truncate max-w-[140px]">
                  {friend?.tagline}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-zinc-50"
              onClick={(e) => onMessage(friend, e)}
              title="Message"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>

            {isDueling ? (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 px-3 gap-1.5 bg-amber-900/30 text-amber-400 hover:bg-amber-900/50"
                onClick={(e) => onSpectate(friend, e)}
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="text-xs">Spectate</span>
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-8 px-3 gap-1.5"
                onClick={(e) => onInvite(friend, e)}
              >
                <Sword className="h-3.5 w-3.5" />
                <span className="text-xs">Invite</span>
              </Button>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem><User />View Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem><UserRoundX />Unfriend</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

/* ---------- User Profile Modal ---------- */
const UserProfileModal = ({ user, onClose, onInvite }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
    <div className="w-full max-w-sm bg-background rounded-xl shadow-2xl border border-zinc-800 overflow-hidden" onClick={e => e.stopPropagation()}>
      <div className="h-24 bg-background border-b border-zinc-800 relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-zinc-400 hover:text-zinc-200 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="px-6 pb-6 relative">
        <div className="h-20 w-20 rounded-full bg-background border-4 border-zinc-950 shadow-sm flex items-center justify-center text-2xl font-bold text-zinc-200 -mt-10 mb-4 relative z-10">
          <Avatar className="h-full w-full">
            <AvatarImage src={`/avatars/${user?.avatarUrl}`} className="rounded-full" />
          </Avatar>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-zinc-50">{user?.name}</h3>
            <div
              className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors mt-0.5"
              onClick={() => {
                navigator.clipboard.writeText(user?.handle);
                alert("Handle copied!");
              }}
            >
              {user?.handle} <Copy className="h-3 w-3" />
            </div>
          </div>
          <Badge variant="outline" className="mt-1">{user.status}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-zinc-900 mb-6">
          <div className="text-center">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Win Rate</div>
            <div className="text-lg font-bold text-emerald-500">
              {user?.wins + user?.losses > 0
                ? Math.round((user?.wins / (user?.wins + user?.losses)) * 100)
                : 0}%
            </div>
          </div>
          <div className="text-center border-l border-zinc-900">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Matches</div>
            <div className="text-lg font-bold text-zinc-50">{user?.wins + user?.losses}</div>
          </div>
          <div className="text-center border-l border-zinc-900">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Rank</div>
            <div className="text-lg font-bold text-zinc-50">{user?.rank}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {user.languages?.map(lang => (
            <span key={lang} className="text-[10px] bg-background text-zinc-400 px-2.5 py-1 rounded-full border border-zinc-800">
              {lang}
            </span>
          ))}
        </div>

        <Button className="w-full" onClick={(e) => { onInvite(e); onClose(); }}>
          Challenge to Duel
        </Button>
      </div>
    </div>
  </div>
);

/* ---------- Requests view ---------- */

const RequestsView = ({
  incoming,
  outgoing,
  search,
  onAccept,
  onIgnore,
  onCancel,
}) => {
  const hasSearch = !!search.trim();
  const noIncoming = incoming.length === 0;
  const noOutgoing = outgoing.length === 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 h-full items-start">
      {/* Incoming */}
      <div className="flex flex-col h-full">
        <h3 className="text-sm font-medium px-1 mb-3 text-zinc-100">Incoming Requests</h3>
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            {noIncoming ? (
              <EmptyState
                label={hasSearch ? "No requests found." : "No incoming requests."}
              />
            ) : (
              <ScrollArea className="h-full">
                <div className="divide-y divide-zinc-900">
                  {incoming.map((req) => (
                    <RequestRow
                      key={req.id}
                      request={req}
                      type="incoming"
                      onAccept={() => onAccept(req)}
                      onIgnore={() => onIgnore(req)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Outgoing */}
      <div className="flex flex-col h-full">
        <h3 className="text-sm font-medium px-1 mb-3 text-zinc-100">Outgoing Requests</h3>
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full">
            {noOutgoing ? (
              <EmptyState
                label={hasSearch ? "No requests found." : "No outgoing requests."}
              />
            ) : (
              <ScrollArea className="h-full">
                <div className="divide-y divide-zinc-900">
                  {outgoing.map((req) => (
                    <RequestRow
                      key={req.id}
                      request={req}
                      type="outgoing"
                      onCancel={() => onCancel(req)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EmptyState = ({ label }) => (
  <div className="h-full flex flex-col items-center justify-center text-xs text-zinc-400 text-center px-4">
    <div className="mb-2 p-3 bg-background rounded-full">
      <Users className="h-5 w-5 text-zinc-600" />
    </div>
    {label}
  </div>
);

const RequestRow = ({ request, type, onAccept, onIgnore, onCancel }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-background/50">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center text-[10px] font-bold text-zinc-400">
          {request.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium leading-none text-zinc-100">{request.name}</p>
          <p className="text-[11px] text-zinc-500 mt-1">
            {request.elo} ELO
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {type === "incoming" ? (
          <>
            <Button onClick={onAccept} className="h-7 bg-primary text-zinc-900 hover:bg-primary">Accept</Button>
            <Button variant="ghost" onClick={onIgnore} className="h-7 text-zinc-500 hover:bg-red-900/20 hover:text-red-400">Ignore</Button>
          </>
        ) : (
          <Button variant="ghost" onClick={onCancel} className="h-7 text-zinc-500 hover:text-zinc-200">Cancel</Button>
        )}
      </div>
    </div>
  );
};

/* ---------- Add friends view ---------- */

const AddFriendsView = ({ results, onAdd }) => {
  return (
    <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
      <div className="pb-3 px-1">
        <h3 className="text-xl font-medium text-zinc-100">Discover People</h3>
      </div>
      <CardContent className="p-0 flex-1 rounded-xl border border-zinc-800 bg-background overflow-hidden shadow-sm">
        {results.length === 0 ? (
          <EmptyState label="No users found." />
        ) : (
          <ScrollArea className="h-full">
            <div className="divide-y divide-zinc-900">
              {results.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-background/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center text-[10px] font-bold text-zinc-400">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={`/avatars/${user?.avatarUrl}`} className="rounded-full" />
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none text-zinc-100">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        {user.elo} ELO
                      </p>
                    </div>
                  </div>
                  <Button
                    size="xs"
                    variant="secondary"
                    className="h-7 px-3"
                    onClick={() => onAdd(user)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsPage;