import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import {
  Utensils,
  Dumbbell,
  Activity,
  Droplets,
  Plus,
  Trash2,
  Calendar,
  User,
  Target,
  Flame,
  Award,
  ChevronRight,
  Clock,
  Filter,
  BookOpen,
  Wrench,
  CheckSquare,
  Zap,
  Sparkles,
  Heart,
  Search,
  Scale,
  Settings,
  Sliders,
  Info,
  Brain,
  ShieldCheck,
  Save,
  Cloud,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

// Katalog Resep & Rekomendasi Makanan Indonesia & Manca Negara Sehat (Variasi Menu Lengkap 40+ Resep)
const INITIAL_MEALS_CATALOG = [
  {
    id: 'm1',
    name: 'Dada Ayam Marinasi Ketumbar & Nasi Merah',
    planCategory: 'fat_loss',
    mealTime: 'siang',
    calories: 460,
    protein: 44,
    carbs: 42,
    fat: 12,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    description: 'Dada ayam tanpa kulit dimarinasi bumbu ketumbar rempah Nusantara, dipanggang teflon tanpa minyak berlebih.',
    ingredients: [
      '200g Dada Ayam Fillet tanpa kulit',
      '1 sdm Bumbu Marinasi (Ketumbar halus, Bawang Putih, Kunyit, Garam)',
      '1 sdm Minyak Zaitun / Minyak Kelapa Murni',
      '100g Nasi Merah Organik Matang',
      '50g Tumis Buncis & Wortel Low-Oil'
    ],
    tools: ['Teflon Anti-Lengket (Pan)', 'Talenan & Pisau', 'Wadah Marinasi', 'Capitan Makanan'],
    instructions: [
      'Cuci bersih dada ayam fillet, lalu sayat tipis permukaan agar bumbu meresap.',
      'Lumuri dada ayam dengan bumbu marinasi (ketumbar, bawang putih, garam) dan biarkan 15-20 menit.',
      'Panaskan teflon anti-lengket dengan 1 sdm minyak zaitun/kelapa murni dengan api sedang.',
      'Panggang ayam selama 6-8 menit tiap sisinya hingga matang kecokelatan dan juicy.',
      'Sajikan bersama nasi merah hangat dan tumis buncis wortel.'
    ]
  },
  {
    id: 'm2',
    name: 'Omelet Putih Telur Sayuran & Oat Gurih',
    planCategory: 'fat_loss',
    mealTime: 'pagi',
    calories: 340,
    protein: 32,
    carbs: 30,
    fat: 8,
    allergens: ['egg'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    description: 'Sarapan kaya protein dari putih telur segar, bayam potong, dan oatmeal gurih berkaldu jamur.',
    ingredients: [
      '4 Butir Putih Telur + 1 Utuh',
      '30g Rolled Oat + 150ml Air/Kaldu Jamur',
      '1 Genggam Bayam Segar & Tomat Dadu',
      '1 sdt Minyak Wijen / Minyak Kelapa'
    ],
    tools: ['Teflon Kecil', 'Mangkuk Pengocok Telur', 'Wisk / Sendok', 'Panci Oat Kecil'],
    instructions: [
      'Kocok putih telur dan telur utuh bersama daun bayam dan dadu tomat, beri sedikit garam/merica.',
      'Dadar telur di teflon dengan sedikit minyak kelapa hingga matang terbalik.',
      'Masak rolled oat dengan air kaldu jamur hingga mengental gurih.',
      'Sajikan omelet berdampingan dengan oat hangat sebagai pembakar energi pagi.'
    ]
  },
  {
    id: 'm3',
    name: 'Pepes Ikan Nila Kemangi & Bayam Bening',
    planCategory: 'fat_loss',
    mealTime: 'malam',
    calories: 380,
    protein: 38,
    carbs: 35,
    fat: 7,
    allergens: ['seafood'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'Ikan nila segar dikukus daun pisang dengan bumbu kunyit kemangi tanpa minyak, sangat ideal untuk makan malam ringan.',
    ingredients: [
      '1 Ekor Ikan Nila Segar (bersihkan)',
      '1 Ikat Daun Kemangi & Daun Pisang Pembungkus',
      'Bumbu Halus (Kunyit, Kemiri, Bawang Merah, Bawang Putih, Cabai)',
      '1 Mangkok Sayur Bening Bayam Jagung',
      '80g Nasi Beras Hitam / Merah'
    ],
    tools: ['Kukusan / Dandang', 'Tali Semprit / Tusuk Gigi', 'Cobek / Blender Bumbu'],
    instructions: [
      'Lumuri ikan nila dengan bumbu halus dan daun kemangi hingga merata.',
      'Bungkus rapi ikan dengan daun pisang, semat kedua ujungnya dengan tusuk gigi.',
      'Kukus selama 25-30 menit hingga bumbu meresap sempurna dan aroma kemangi keluar.',
      'Nikmati malam hari bersama kuah bayam bening tanpa rasa bersalah.'
    ]
  },
  {
    id: 'm4',
    name: 'Dada Ayam Sambal Matah & Nasi Singkong',
    planCategory: 'muscle_gain',
    mealTime: 'siang',
    calories: 640,
    protein: 56,
    carbs: 62,
    fat: 16,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    description: 'Extra porsi dada ayam panggang dengan sambal matah minyak kelapa murni, tahu bacem kukus, dan nasi singkong.',
    ingredients: [
      '250g Dada Ayam Panggang',
      'Bahan Sambal Matah (Bawang Merah, Serai, Cabai Rawit, Terasi, Minyak Kelapa Murni Warm)',
      '150g Nasi Singkong / Nasi Merah',
      '2 Potong Tahu Kukus Bumbu Bacem Tipis'
    ],
    tools: ['Teflon Panggang', 'Cobek / Mangkuk Sambal', 'Pisau Iris'],
    instructions: [
      'Panggang dada ayam yang sudah dimarinasi garam dan lada hingga matang.',
      'Iris tipis bawang merah, serai, dan cabai rawit. Siram dengan minyak kelapa hangat.',
      'Sajikan dada ayam di atas nasi singkong hangat lalu beri toping sambal matah.'
    ]
  },
  {
    id: 'm5',
    name: 'Smoothie Bowl Pisang, Protein Whey & Selai Kacang',
    planCategory: 'muscle_gain',
    mealTime: 'pagi',
    calories: 520,
    protein: 42,
    carbs: 65,
    fat: 14,
    allergens: ['nuts', 'dairy'],
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80',
    description: 'Sarapan cepat tinggi energi dan protein untuk membakar pembentukan jaringan otot.',
    ingredients: [
      '2 Buah Pisang Ambon Beku',
      '1 Scoop Whey Protein (Rasa Cokelat/Vanilla)',
      '1 sdm Selai Kacang Alami (Peanut Butter)',
      '200ml Susu Low Fat / Milk Soy',
      'Topping: Biji Chia & Irisan Almond'
    ],
    tools: ['Blender High Speed', 'Mangkuk Smoothie', 'Sendok Utensil'],
    instructions: [
      'Masukkan pisang beku, whey protein, selai kacang, dan susu ke dalam blender.',
      'Blender hingga tekstur mengental seperti es krim lembut.',
      'Tuang ke mangkuk, taburi irisan almond dan biji chia di atasnya.'
    ]
  },
  {
    id: 'm6',
    name: 'Rendang Sapi Lean Meat & Tahu Kukus',
    planCategory: 'muscle_gain',
    mealTime: 'malam',
    calories: 610,
    protein: 50,
    carbs: 55,
    fat: 20,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Daging sapi bagian tenderloin tanpa lemak dimasak rendang santan encer rendah kalori.',
    ingredients: [
      '180g Sapi Tenderloin Bebas Lemak',
      'Bumbu Rendang Rempah Nusantara (Kunyit, Lengkuas, Cabai, Cabai Merah)',
      '100ml Santan Encer Low-Fat',
      '120g Nasi Merah / Tiwul',
      '2 Potong Tahu Putih Kukus'
    ],
    tools: ['Wajan / Slow Cooker', 'Spatula Kayu'],
    instructions: [
      'Ungkep daging sapi bersama bumbu halus rendang dan santan encer.',
      'Masak dengan api kecil (slow cook) hingga daging empuk dan bumbu meresap browning tanpa minyak berlebih.',
      'Sajikan bersama nasi merah hangat dan tahu kukus.'
    ]
  },
  {
    id: 'm7',
    name: 'Soto Ayam Kampung Bening (Tanpa Santan)',
    planCategory: 'fat_loss',
    mealTime: 'pagi',
    calories: 360,
    protein: 34,
    carbs: 36,
    fat: 9,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'Soto ayam berkuah bening kaya bumbu rempah daun jeruk & serai dengan bihun jagung dan 2 butir telur rebus.',
    ingredients: [
      '150g Suwiran Dada Ayam Kampung Kukus',
      'Bumbu Kuah Soto Bening (Kunyit, Jahe, Serai, Daun Jeruk, Bawang Putih)',
      '50g Bihun Jagung / Soun Kukus',
      '1 Butir Telur Rebus & Tauge Segar',
      'Sambal Rawit & Perasan Jeruk Nipis'
    ],
    tools: ['Panci Kuah', 'Sendok Sayur', 'Mangkuk Soto'],
    instructions: [
      'Rebus dada ayam bersama rempah soto bening hingga kaldu keluar gurih.',
      'Angkat ayam lalu suwir-suwir halus.',
      'Tata bihun jagung, tauge, dan telur rebus di mangkuk, siram dengan kuah soto panas.',
      'Beri suwiran ayam, perasan jeruk nipis, dan sambal secukupnya.'
    ]
  },
  {
    id: 'm8',
    name: 'Sate Ayam Grill Teppan (Bumbu Kacang Low-Sugar)',
    planCategory: 'muscle_gain',
    mealTime: 'siang',
    calories: 590,
    protein: 52,
    carbs: 48,
    fat: 18,
    allergens: ['nuts'],
    image: 'https://images.unsplash.com/photo-1529563028521-8288825c4ef9?auto=format&fit=crop&w=600&q=80',
    description: '10 tusuk sate dada ayam tanpa lemak digrill panggang teflon, disajikan dengan bumbu kacang halus dan lontong.',
    ingredients: [
      '220g Dada Ayam Fillet Dadu (10 Tusuk Sate)',
      '3 sdm Bumbu Kacang Sangrai Low-Sugar',
      '100g Lontong Beras Merah / Putih',
      'Acar Mentimun & Bawang Merah Iris'
    ],
    tools: ['Tusuk Sate Bambu', 'Teflon Grill Pan', 'Kuas Bumbu'],
    instructions: [
      'Tusuk dada ayam dadu ke tusukan sate.',
      'Olesi sedikit kecap manis rendah gula dan panggang di atas teflon grill hingga kecokelatan beraroma smoke.',
      'Siram dengan bumbu kacang sangrai hangat dan sajikan bersama irisan lontong.'
    ]
  },

  /* RESEP TAMBAHAN INDONESIA & MANCA NEGARA (32 MENU BARU) */
  {
    id: 'm9',
    name: 'Pepes Dada Ayam Kemangi & Nasi Merah (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'siang',
    calories: 410,
    protein: 42,
    carbs: 38,
    fat: 9,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Olahan tradisional kukus dalam daun pisang kaya antioksidan kemangi, gurih alami tanpa minyak goreng.',
    ingredients: [
      '200g Dada Ayam Fillet Potong Dadu',
      '2 Ikat Daun Kemangi Segar',
      'Bumbu Halus (Bawang Merah, Bawang Putih, Kunyit, Kemiri, Cabai Merah, Garam)',
      'Daun Pisang & Tusuk Gigi',
      '100g Nasi Merah Matang'
    ],
    tools: ['Kukusan / Dandang', 'Cobek / Blender', 'Talenan & Pisau'],
    instructions: [
      'Campur dada ayam fillet dengan bumbu halus dan daun kemangi segar hingga rata.',
      'Bungkus adonan dengan daun pisang, semat kedua ujungnya dengan tusuk gigi.',
      'Kukus selama 25 menit hingga ayam matang empuk.',
      'Panggang sebentar bungkusan pepes di atas teflon kering agar daun pisang wangi karamelisasi.'
    ]
  },
  {
    id: 'm10',
    name: 'Sup Daging Sapi Bening & Wortel Kentang (Indonesia)',
    planCategory: 'muscle_gain',
    mealTime: 'malam',
    calories: 540,
    protein: 45,
    carbs: 52,
    fat: 16,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    description: 'Sup rempah pala & lada putih dengan daging sapi bagian sengkel/tenderloin tanpa lemak.',
    ingredients: [
      '180g Daging Sapi Tenderloin Potong Dadu',
      '1 Buah Kentang Sedang & 1 Buah Wortel Iris',
      'Bumbu Sup (Bawang Putih Geprek, Bawang Merah, Pala Bubuk, Merica, Garam)',
      'Daun Bawang & Seledri Potong',
      '100g Nasi Putih / Merah'
    ],
    tools: ['Panci Sup', 'Sendok Sayur', 'Pisau & Talenan'],
    instructions: [
      'Rebus daging sapi dalam 600ml air hingga empuk, buang busa lemak yang mengapung.',
      'Masukkan bawang putih geprek, pala, lada, garam, wortel, dan kentang.',
      'Rebus hingga sayuran empuk dan kuah gurih beraroma harum.',
      'Taburi daun bawang seledri dan sajikan hangat bersama nasi.'
    ]
  },
  {
    id: 'm11',
    name: 'Tumis Tahu Tempe Kecap Low-Oil & Nasi Jagung (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'malam',
    calories: 370,
    protein: 26,
    carbs: 48,
    fat: 10,
    allergens: ['soy'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Protein nabati terjangkau tinggi serat dari tempe dan tahu dengan bumbu kecap manis rendah gula.',
    ingredients: [
      '100g Tempe & 100g Tahu Putih Potong Dadu',
      '1.5 sdm Kecap Manis Low-Sugar',
      '1 sdt Minyak Kelapa Murni',
      'Bumbu Tumis (Bawang Merah, Bawang Putih, Cabai Hijau Iris, Lengkuas, Daun Salam)',
      '100g Nasi Jagung / Merah'
    ],
    tools: ['Teflon Wok', 'Spatula'],
    instructions: [
      'Tumis bawang merah, bawang putih, cabai hijau, lengkuas, dan daun salam dengan 1 sdt minyak kelapa.',
      'Masukkan tahu dan tempe dadu, aduk rata.',
      'Beri kecap manis low-sugar dan sedikit air, masak hingga bumbu meresap kecokelatan.'
    ]
  },
  {
    id: 'm12',
    name: 'Gado-Gado Surabaya Low-Peanut & Telur Rebus (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'siang',
    calories: 390,
    protein: 24,
    carbs: 45,
    fat: 13,
    allergens: ['nuts', 'egg'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'Salad sayuran rebus khas Nusantara dengan saus kacang sangrai rendah gula & minyak.',
    ingredients: [
      '2 Butir Telur Ayam Rebus Utuh',
      'Sayuran Rebus (Kangkung, Tauge, Buncis, Labu Siam)',
      '1 Potong Tahu Rebus',
      '2 sdm Bumbu Kacang Sangrai Halus (dilarutkan air hangat)',
      '50g Kentang Rebus Potong'
    ],
    tools: ['Panci Rebusan', 'Mangkuk Salad', 'Saringan Sayur'],
    instructions: [
      'Rebus kangkung, tauge, buncis, labu siam, kentang, dan telur hingga matang.',
      'Tata sayuran rebus, kentang, dan belahan telur di atas piring.',
      'Siram dengan bumbu kacang sangrai encer rendah minyak dan gula.'
    ]
  },
  {
    id: 'm13',
    name: 'Ikan Bakar Sambal Dabu-Dabu & Nasi Merah (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'siang',
    calories: 420,
    protein: 40,
    carbs: 40,
    fat: 10,
    allergens: ['seafood'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    description: 'Ikan kembung/gurame panggang bumbu kunyit disiram irisan segar sambal dabu-dabu khas Manado.',
    ingredients: [
      '1 Ekor Ikan Kembung / Fillet Gurame (180g)',
      'Bumbu Marinasi (Kunyit, Garam, Perasan Jeruk Nipis)',
      'Bahan Dabu-Dabu (Tomat Merah/Hijau Dadu, Bawang Merah Iris, Cabai Rawit, Perasan Lemon, 1 sdt Minyak Zaitun)',
      '100g Nasi Merah'
    ],
    tools: ['Teflon Grill Pan', 'Mangkuk Sambal', 'Kuas Bumbu'],
    instructions: [
      'Lumuri ikan dengan perasan jeruk nipis, kunyit, dan garam. Panggang teflon hingga matang kecokelatan.',
      'Campur tomat dadu, irisan bawang merah, cabai rawit, perasan lemon, dan 1 sdt minyak zaitun di mangkuk.',
      'Sajikan ikan panggang panas disiram sambal dabu-dabu segar bersama nasi merah.'
    ]
  },
  {
    id: 'm14',
    name: 'Nasi Tiwul Ayam Suwir Sambal Hijau (Indonesia)',
    planCategory: 'muscle_gain',
    mealTime: 'siang',
    calories: 580,
    protein: 48,
    carbs: 68,
    fat: 12,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    description: 'Karbohidrat kompleks tradisional pengganti nasi (Tiwul Singkong) dipadu dada ayam suwir sambal hijau.',
    ingredients: [
      '200g Dada Ayam Ungkep Suwir',
      '120g Nasi Tiwul Singkong Kukus',
      '2 sdm Sambal Hijau Kukus Low-Oil (Cabai Hijau, Tomat Hijau, Bawang Merah Kukus)',
      '1 Potong Tempe Bacem Kukus'
    ],
    tools: ['Kukusan Tiwul', 'Teflon Tumis Sambal', 'Garpu Suwir'],
    instructions: [
      'Kukus nasi tiwul singkong hingga lembut kenyal.',
      'Tumis sebentar sambal hijau kukus dengan sedikit minyak kelapa, lalu masukkan suwiran ayam ungkep.',
      'Sajikan ayam suwir di atas nasi tiwul panas bersama tempe bacem kukus.'
    ]
  },
  {
    id: 'm15',
    name: 'Sup Merah Sosis Ayam Suwir & Oat (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'pagi',
    calories: 330,
    protein: 28,
    carbs: 38,
    fat: 7,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    description: 'Sarapan kuah tomat kaya vitamin C dengan oatmeal pengganti pasta dan suwiran dada ayam.',
    ingredients: [
      '100g Suwiran Dada Ayam Rebus',
      '2 sdm Pasta Tomat Murni / 2 Buah Tomat Halus',
      '30g Rolled Oat',
      'Wortel & Kacang Polong Rebus',
      'Bawang Putih, Merica & Garam'
    ],
    tools: ['Panci Sup Kecil', 'Blender / Parutan Tomat'],
    instructions: [
      'Rebus tumisan bawang putih dan puree tomat murni dalam 400ml air.',
      'Masukkan rolled oat, dada ayam suwir, wortel, dan kacang polong.',
      'Bumbui garam dan merica, masak hingga oat mengental gurih seperti sup merah Surabaya.'
    ]
  },
  {
    id: 'm16',
    name: 'Sate Lilit Ikan Tenggiri Batang Serai (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'siang',
    calories: 430,
    protein: 42,
    carbs: 36,
    fat: 11,
    allergens: ['seafood'],
    image: 'https://images.unsplash.com/photo-1529563028521-8288825c4ef9?auto=format&fit=crop&w=600&q=80',
    description: 'Sate khas Bali dari daging ikan tenggiri giling bumbu genep yang dililitkan pada batang serai segar.',
    ingredients: [
      '200g Daging Ikan Tenggiri Giling',
      '6 Batang Serai Segar (Tangkai Sate)',
      '2 sdm Kelapa Parut Sangrai',
      'Bumbu Genep Halus (Kunyit, Lengkuas, Kencur, Bawang Merah, Bawang Putih, Cabai)',
      '100g Nasi Merah'
    ],
    tools: ['Teflon Panggang', 'Mangkuk Adonan'],
    instructions: [
      'Campur gilingan ikan tenggiri, bumbu genep halus, dan kelapa parut sangrai hingga kalis.',
      'Lilitkan adonan pada ujung batang serai.',
      'Panggang sate lilit di atas teflon anti-lengket hingga matang harum karamelisasi.'
    ]
  },
  {
    id: 'm17',
    name: 'Bubur Manado (Tinutuan) Telur Rebus (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'pagi',
    calories: 320,
    protein: 20,
    carbs: 46,
    fat: 6,
    allergens: ['egg'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'Bubur sehat kaya serat dari campuran labu kuning, bayam, kangkung, jagung manis, dan telur rebus.',
    ingredients: [
      '50g Beras Merah / Putih (dimasak bubur)',
      '80g Labu Kuning Kukus Halus',
      'Jagung Pipil, Daun Bayam, Kangkung, & Daun Kemangi',
      '2 Butir Telur Ayam Rebus Utuh',
      'Sambal Roa / Sambal Terasi Low-Oil'
    ],
    tools: ['Panci Bubur', 'Pengocok/Pengaduk Kayu'],
    instructions: [
      'Masak beras bersama air hingga menjadi bubur lembut.',
      'Masukkan halusan labu kuning, jagung pipil, bayam, kangkung, dan kemangi.',
      'Aduk hingga sayuran matang dan warna bubur kuning keemasan. Sajikan dengan telur rebus.'
    ]
  },
  {
    id: 'm18',
    name: 'Rawon Sapi Lean Meat & Tauge Short-Sprout (Indonesia)',
    planCategory: 'muscle_gain',
    mealTime: 'malam',
    calories: 560,
    protein: 48,
    carbs: 50,
    fat: 18,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Sup daging sapi kuah hitam khas Jawa Timur menggunakan keluak asli dan daging sengkel bebas lemak.',
    ingredients: [
      '180g Daging Sapi Tenderloin/Sengkel Bebas Lemak',
      'Bumbu Rawon (Keluak Halus, Bawang Merah, Bawang Putih, Ketumbar, Serai, Daun Jeruk)',
      '1 Genggam Tauge Pendek Segar & Sambal Terasi',
      '110g Nasi Merah'
    ],
    tools: ['Panci Sup', 'Cobek Bumbu Keluak'],
    instructions: [
      'Tumis bumbu rawon keluak dengan sedikit air/minyak hingga wangi harum.',
      'Rebus daging sapi bersama bumbu keluak hingga empuk meresap berwarna hitam pekat.',
      'Sajikan panas bersama tauge pendek segar, sambal, dan nasi merah.'
    ]
  },
  {
    id: 'm19',
    name: 'Ayam Ungkep Kuning Panggang & Sambal Terasi (Indonesia)',
    planCategory: 'muscle_gain',
    mealTime: 'siang',
    calories: 620,
    protein: 54,
    carbs: 58,
    fat: 16,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    description: 'Dada ayam utuh diungkep bumbu rempah kuning kunyit lengkuas lalu dipanggang garing tanpa gorengan minyak.',
    ingredients: [
      '220g Dada Ayam Utuh Tanpa Kulit',
      'Bumbu Ungkep (Kunyit, Lengkuas, Ketumbar, Serai, Salam, Bawang Putih)',
      '150g Nasi Merah / Putih Organik',
      'Lalapan Mentimun & Kemangi'
    ],
    tools: ['Ungkepan Panci', 'Teflon Grill'],
    instructions: [
      'Ungkep dada ayam bersama bumbu kuning dan air secukupnya hingga bumbu meresap kering.',
      'Panggang dada ayam di atas teflon grill hingga bagian luar agak garing beraroma gurih.',
      'Sajikan bersama sambal terasi kukus dan lalapan segar.'
    ]
  },
  {
    id: 'm20',
    name: 'Tumis Kangkung Dada Ayam Cincang (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'malam',
    calories: 360,
    protein: 36,
    carbs: 32,
    fat: 8,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Sayur kangkung segar ditumis cepat dengan potongan cincang dada ayam dan saus tiram low-sodium.',
    ingredients: [
      '150g Dada Ayam Fillet Cincang Kasar',
      '1 Ikat Kangkung Segar (siangi)',
      '1 sdm Saus Tiram Low-Sodium',
      '1 sdt Minyak Wijen',
      'Bawang Putih & Cabai Rawit Iris'
    ],
    tools: ['Wok Pan / Teflon', 'Spatula'],
    instructions: [
      'Tumis bawang putih dan cabai rawit iris dengan minyak wijen hingga wangi.',
      'Masukkan cincangan dada ayam, masak hingga berubah warna matang.',
      'Masukkan kangkung dan saus tiram, tumis dengan api besar selama 2 menit agar kangkung tetap hijau renyah.'
    ]
  },
  {
    id: 'm21',
    name: 'Sup Gurame Bening Daun Kemangi (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'malam',
    calories: 390,
    protein: 42,
    carbs: 34,
    fat: 8,
    allergens: ['seafood'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'Sup ikan gurame segar kuah bening asam segar perasan lemon dan kemangi penyegar malam hari.',
    ingredients: [
      '200g Fillet Ikan Gurame Segar',
      'Bumbu Kuah Bening (Jahe Geprek, Kunyit Iris, Bawang Putih, Daun Jeruk, Serai, Tomat Hijau)',
      '1 Ikat Daun Kemangi Segar',
      '80g Nasi Merah'
    ],
    tools: ['Panci Sup', 'Pisau'],
    instructions: [
      'Rebus air bersama jahe, kunyit, serai, daun jeruk, dan tomat hijau hingga mendidih wangi.',
      'Masukkan potongan fillet ikan gurame, masak 7-10 menit dengan api sedang.',
      'Saat matang, masukkan daun kemangi dan perasan jeruk nipis. Angkat dan sajikan.'
    ]
  },
  {
    id: 'm22',
    name: 'Bubur Ayam Kampung Tanpa Kerupuk & Minyak (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'pagi',
    calories: 350,
    protein: 30,
    carbs: 42,
    fat: 7,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'Bubur beras lembut dengan kaldu asli ayam kampung, suwiran melimpah, dan kacang kedelai sangrai.',
    ingredients: [
      '60g Beras Merah / Putih (dimasak bubur kaldu)',
      '120g Suwiran Dada Ayam Kampung Kukus',
      '1 sdm Kacang Kedelai Sangrai',
      'Cakwe Iris Tipis (opsional), Daun Bawang, Seledri, & Kecap Asin Low-Sodium'
    ],
    tools: ['Panci Bubur', 'Sendok Kuah'],
    instructions: [
      'Masak beras dengan kaldu rebusan dada ayam kampung hingga menjadi bubur lembut.',
      'Tuang bubur ke mangkuk, beri topping suwiran dada ayam melimpah, kedelai sangrai, dan seledri.',
      'Kucuri sedikit kecap asin dan sambal rawit rebus.'
    ]
  },
  {
    id: 'm23',
    name: 'Ayam Pop Dada Fillet Kukus & Sambal Tomat (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'siang',
    calories: 440,
    protein: 46,
    carbs: 40,
    fat: 10,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
    description: 'Ayam pop khas Minang versi sehat tanpa santan kental, dimasak air kelapa murni dan dikukus juicy.',
    ingredients: [
      '200g Dada Ayam Fillet',
      '200ml Air Kelapa Murni (untuk merebus/ mengukus)',
      'Bumbu halus (Bawang Putih, Bawang Merah, Jahe, Garam)',
      'Sambal Tomat Kukus (Tomat Merah & Cabai Rebus Halus)',
      '100g Nasi Merah & Daun Singkong Rebus'
    ],
    tools: ['Panci Ungkep Air Kelapa', 'Cobek Sambal'],
    instructions: [
      'Ungkep dada ayam dalam air kelapa murni dan bumbu halus hingga empuk putih bersih khas ayam pop.',
      'Tiriskan ayam (tidak perlu digoreng minyak banyak).',
      'Sajikan bersama daun singkong rebus dan sambal tomat kukus hangat.'
    ]
  },
  {
    id: 'm24',
    name: 'Mie Shirataki Goreng Jawa Ayam & Sayur (Indonesia)',
    planCategory: 'fat_loss',
    mealTime: 'malam',
    calories: 310,
    protein: 32,
    carbs: 22,
    fat: 9,
    allergens: ['egg'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'Solusi mie goreng bebas rasa bersalah menggunakan Mie Shirataki bebas kalori karbohidrat.',
    ingredients: [
      '150g Mie Shirataki Basah (cuci air panas)',
      '100g Suwiran Dada Ayam Panggang',
      '1 Butir Telur Orak-Arik',
      'Sayuran (Sawi Hijau, Kol Iris, Wortel)',
      '1 sdm Kecap Manis Low-Sugar & 1 sdt Minyak Wijen'
    ],
    tools: ['Teflon Wok', 'Spatula'],
    instructions: [
      'Seduh mie shirataki dengan air panas lalu tiriskan.',
      'Tumis telur orak-arik dan bumbu halus mie jawa (bawang putih, kemiri, merica).',
      'Masukkan suwiran ayam, mie shirataki, sayuran, dan kecap manis. Tumis hingga meresap.'
    ]
  },

  /* MANCA NEGARA (INTERNATIONAL DISHES ADAPTED FOR INDONESIAN KITCHEN) */
  {
    id: 'm25',
    name: 'Chicken Teriyaki Grill & Nasi Merah (Jepang)',
    planCategory: 'muscle_gain',
    mealTime: 'siang',
    calories: 590,
    protein: 50,
    carbs: 60,
    fat: 14,
    allergens: ['soy'],
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    description: 'Dada ayam grill bumbu saus teriyaki Jepang homemade rendah gula dengan taburan biji wijen sangrai.',
    ingredients: [
      '220g Dada Ayam Fillet Potong Dadu',
      'Saus Teriyaki Homemade (2 sdm Kecap Asin/Soy Sauce, 1 sdm Madu/Minyak Wijen, Jahe Parut, Bawang Putih)',
      '1 sdt Biji Wijen Sangrai',
      '130g Nasi Merah',
      'Rebusan Brokoli & Wortel'
    ],
    tools: ['Teflon Grill', 'Mangkuk Marinasi'],
    instructions: [
      'Marinasi dada ayam dengan saus teriyaki homemade selama 15 menit.',
      'Panggang ayam di atas teflon hingga saus terkaramelisasi cokelat mengkilap.',
      'Taburi biji wijen sangrai di atasnya dan sajikan bersama nasi merah dan brokoli.'
    ]
  },
  {
    id: 'm26',
    name: 'Beef Bulgogi Lean Meat & Kimchi Lokal (Korea)',
    planCategory: 'muscle_gain',
    mealTime: 'malam',
    calories: 610,
    protein: 48,
    carbs: 55,
    fat: 18,
    allergens: ['soy'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Irisan tipis daging sapi sukiyaki tanpa lemak tumis bumbu bulgogi manis gurih disajikan dengan kimchi.',
    ingredients: [
      '180g Daging Sapi Slice Low-Fat (Sukiyaki Slice)',
      'Bumbu Bulgogi (Parutan Buah Pir/Apel Lokal, Soy Sauce, Bawang Putih, Minyak Wijen, Lada Hitam)',
      '50g Kimchi Sawi Segar',
      '120g Nasi Merah / Putih'
    ],
    tools: ['Wok Pan', 'Parutan Buah'],
    instructions: [
      'Marinasi daging sapi slice dengan parutan buah pir dan bumbu bulgogi selama 20 menit.',
      'Tumis cepat di wajan panas selama 3-5 menit agar daging tetap empuk juicy.',
      'Sajikan bersama kimchi sawi asam segar dan nasi hangat.'
    ]
  },
  {
    id: 'm27',
    name: 'Chicken Breast Salad Wijen Sangrai (Western/Asian)',
    planCategory: 'fat_loss',
    mealTime: 'siang',
    calories: 380,
    protein: 40,
    carbs: 22,
    fat: 14,
    allergens: ['nuts'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'Salad segar daun selada, mentimun, tomat ceri dengan potongan dada ayam panggang dan dressing roasted sesame.',
    ingredients: [
      '180g Dada Ayam Panggang Iris',
      'Sayur Salad (Selada Romaine/Hijau, Mentimun, Tomat Ceri, Jagung Manis)',
      '1.5 sdm Dressing Roasted Sesame (Wijen Sangrai Light)',
      '1 sdm Sangrai Kacang Almond / Mede Cincang'
    ],
    tools: ['Mangkuk Salad Besar', 'Capitan Salad'],
    instructions: [
      'Tata selada, mentimun, tomat ceri, dan jagung manis di mangkuk salad.',
      'Letakkan irisan dada ayam panggang di atasnya.',
      'Siram dengan dressing wijen sangrai dan taburi cincangan almond renyah.'
    ]
  },
  {
    id: 'm28',
    name: 'Spaghetti Bolognese Sapi Cincang Low-Oil (Italia)',
    planCategory: 'muscle_gain',
    mealTime: 'siang',
    calories: 590,
    protein: 44,
    carbs: 68,
    fat: 14,
    allergens: ['wheat'],
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    description: 'Pasta spaghetti whole-wheat dengan saus Bolognese buatan sendiri dari tomat segar dan daging sapi giling lean.',
    ingredients: [
      '80g Pasta Spaghetti Whole-Wheat (La Fonte/gandum utuh)',
      '150g Daging Sapi Giling Bebas Lemak',
      '2 Buah Tomat Merah Halus + 2 sdm Pasta Tomat Murni',
      'Bawang Bombay, Bawang Putih, Oregano Kering, Garam',
      '1 sdt Taburan Keju Parmesan / Cheddar Parut'
    ],
    tools: ['Panci Rebus Pasta', 'Teflon Saus Bolognese'],
    instructions: [
      'Rebus spaghetti whole-wheat dalam air mendidih bergaram hingga al-dente (8-10 menit).',
      'Tumis bawang bombay dan bawang putih, masukkan daging sapi giling hingga matang.',
      'Tuang tomat halus, oregano, dan garam. Masak hingga saus Bolognese kental harum.',
      'Campur spaghetti dengan saus Bolognese dan beri taburan keju parut.'
    ]
  },
  {
    id: 'm29',
    name: 'Tom Yum Ayam & Jamur Kuah Bening (Thailand)',
    planCategory: 'fat_loss',
    mealTime: 'malam',
    calories: 340,
    protein: 36,
    carbs: 26,
    fat: 8,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'Sup Thailand asam pedas menggugah selera dari daun jeruk, serai, perasan jeruk nipis, dan jamur tiram.',
    ingredients: [
      '180g Dada Ayam Fillet Potong Dadu',
      '100g Jamur Tiram / Jamur Kancing Iris',
      'Bumbu Tom Yum (Serai Geprek, Lengkuas, Daun Jeruk, Cabai Rawit Halus, Perasan Jeruk Nipis, Kecap Ikan/Asin)',
      '60g Nasi Merah'
    ],
    tools: ['Panci Sup', 'Pisau'],
    instructions: [
      'Rebus 500ml air bersama serai, lengkuas, daun jeruk, dan cabai rawit hingga aromanya keluar.',
      'Masukkan potongan dada ayam dan jamur, masak hingga ayam matang.',
      'Beri kecap asin dan perasan jeruk nipis segar sebelum diangkat. Nikmati hangat malam hari.'
    ]
  },
  {
    id: 'm30',
    name: 'Japanese Chicken Curry Low-Fat & Nasi Merah (Jepang)',
    planCategory: 'muscle_gain',
    mealTime: 'siang',
    calories: 630,
    protein: 48,
    carbs: 72,
    fat: 15,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Kari Jepang kental bumbu rempah bubuk kari tanpa santan atau mentega berlebih, kaya kentang dan wortel.',
    ingredients: [
      '200g Dada Ayam Potong Dadu',
      '1 Buah Kentang & 1 Buah Wortel Dadu',
      '1/2 Bawang Bombay Iris',
      'Bumbu Kari (1.5 sdm Bubuk Kari Jepang/Indofood Curry, Kaldu Jamur, Garam, 1 sdm Tepung Maizena pengental)',
      '130g Nasi Merah'
    ],
    tools: ['Panci Kari', 'Pengaduk Kayu'],
    instructions: [
      'Tumis bawang bombay hingga harum, masukkan dada ayam hingga berubah warna.',
      'Tuang 400ml air, masukkan kentang dan wortel dadu.',
      'Aduk bubuk kari dan larutan maizena hingga kuah meletup kental gurih.',
      'Sajikan kuah kari kental bersama nasi merah.'
    ]
  },
  {
    id: 'm31',
    name: 'Chicken Wrap Tortilla Whole Wheat (Meksiko/Western)',
    planCategory: 'fat_loss',
    mealTime: 'pagi',
    calories: 390,
    protein: 34,
    carbs: 42,
    fat: 10,
    allergens: ['wheat'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    description: 'Sarapan praktis roti tortilla gandum diisi irisan dada ayam panggang, selada renyah, dan saus greek yogurt.',
    ingredients: [
      '1 Lembar Tortilla Gandum Utuh (Whole-Wheat Wrap)',
      '120g Dada Ayam Panggang Suwir/Iris',
      'Sayuran (Selada, Tomat Iris, Mentimun)',
      '2 sdm Greek Yogurt Plain / Mayones Low-Fat'
    ],
    tools: ['Teflon Penghangat Tortilla'],
    instructions: [
      'Hangatkan lembar tortilla gandum di atas teflon kering selama 30 detik.',
      'Tata selada, tomat, mentimun, dan dada ayam di tengah tortilla.',
      'Beri olesan greek yogurt / mayo low-fat, lalu gulung padat dan potong serong dua.'
    ]
  },
  {
    id: 'm32',
    name: 'Avocado & Poached Egg Toast Roti Gandum (Western)',
    planCategory: 'fat_loss',
    mealTime: 'pagi',
    calories: 360,
    protein: 22,
    carbs: 34,
    fat: 16,
    allergens: ['wheat', 'egg'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    description: 'Sarapan estetik & bernutrisi tinggi lemak sehat dari alpukat mentega lokal dan telur ceplok air (poached egg).',
    ingredients: [
      '2 Lembar Roti Gandum Utuh Panggang',
      '1/2 Buah Alpukat Mentega Lokal (hancurkan dengan garpu + sedikit garam & lada)',
      '2 Butir Telur Ayam (dimasak Poached Egg / Ceplok Air)',
      'Taburan Lada Hitam & Chili Flakes'
    ],
    tools: ['Toaster / Teflon Roti', 'Panci Rebus Telur Air', 'Garpu'],
    instructions: [
      'Panggang roti gandum hingga garing renyah.',
      'Lumatkan alpukat mentega dengan garpu, bumbui sedikit garam dan lada.',
      'Rebus air ber cuka sedikit, buat pusaran air dan masukkan telur hingga menjadi poached egg setengah matang.',
      'Oleskan alpukat di atas roti panggang, beri topping poached egg dan taburi chili flakes.'
    ]
  },
  {
    id: 'm33',
    name: 'Greek Yogurt Bowl Pisang Mede (Yunani/Mediterranean)',
    planCategory: 'fat_loss',
    mealTime: 'pagi',
    calories: 330,
    protein: 26,
    carbs: 40,
    fat: 8,
    allergens: ['dairy', 'nuts'],
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=80',
    description: 'Mangkuk yogurt kental tinggi protein alami dengan irisan pisang ambon dan kacang mede sangrai.',
    ingredients: [
      '170g Greek Yogurt Plain Low-Fat',
      '1 Buah Pisang Ambon Iris',
      '1 sdm Kacang Mede Sangrai Cincang',
      '1 sdt Madu Murni & Biji Chia'
    ],
    tools: ['Mangkuk Sajian', 'Sendok Utensil'],
    instructions: [
      'Tuang greek yogurt plain ke dalam mangkuk.',
      'Tata irisan pisang ambon dan kacang mede sangrai di atasnya.',
      'Kucuri sedikit madu murni dan taburi biji chia.'
    ]
  },
  {
    id: 'm34',
    name: 'Chicken Breast Steak & Roasted Potato (Western)',
    planCategory: 'muscle_gain',
    mealTime: 'malam',
    calories: 590,
    protein: 52,
    carbs: 56,
    fat: 14,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Steak dada ayam fillet panggang herbal oregano disajikan dengan kentang panggang dadu dan saus blackpepper.',
    ingredients: [
      '220g Dada Ayam Fillet Steak Cut',
      '150g Kentang Potong Dadu (dipanggang teflon/oven dengan rosemary/garam)',
      'Saus Blackpepper (Saus Tiram Low-Sodium, Lada Hitam Tumbuk, Bawang Putih, Kaldu)',
      'Rebusan Jagung, Buncis & Wortel'
    ],
    tools: ['Teflon Grill Pan', 'Wadah Marinasi Steak'],
    instructions: [
      'Bumbui dada ayam dengan lada hitam, oregano, dan garam. Panggang di teflon grill hingga matang bergaris grill.',
      'Panggang kentang dadu dengan sedikit minyak zaitun hingga garing luar.',
      'Masak saus blackpepper kental, lalu siram di atas steak dada ayam panas.'
    ]
  },
  {
    id: 'm35',
    name: 'Nasi Hainan Dada Ayam Kukus (Singapura/China)',
    planCategory: 'muscle_gain',
    mealTime: 'siang',
    calories: 610,
    protein: 48,
    carbs: 64,
    fat: 15,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    description: 'Nasi gurih harum berkaldu jahe & minyak wijen dipadukan dengan dada ayam kukus juicy khas Hainan.',
    ingredients: [
      '200g Dada Ayam Kukus (dimarinasi jahe parut & minyak wijen)',
      '130g Nasi Merah / Putih dimasak dengan air kaldu ayam & jahe geprek',
      'Saus Jahe Bawang (Bawang Putih Cincang, Jahe Parut, Minyak Wijen Warm, Kecap Asin Light)',
      'Irisan Mentimun Segar'
    ],
    tools: ['Rice Cooker Kaldu', 'Kukusan Ayam'],
    instructions: [
      'Masak beras dalam rice cooker menggunakan air kaldu rebusan dada ayam dan jahe geprek.',
      'Kukus dada ayam fillet hingga juicy empuk, lalu potong-potong serong.',
      'Sajikan ayam di atas nasi Hainan harum, kucuri saus jahe bawang putih dan mentimun.'
    ]
  },
  {
    id: 'm36',
    name: 'Shakshuka Telur & Roti Gandum (Timur Tengah)',
    planCategory: 'fat_loss',
    mealTime: 'pagi',
    calories: 370,
    protein: 24,
    carbs: 38,
    fat: 14,
    allergens: ['egg', 'wheat'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    description: 'Telur ceplok matang dalam rebusan saus tomat pedas rempah paprika & bubuk jintan khas Timur Tengah.',
    ingredients: [
      '2 Butir Telur Ayam Utuh',
      '2 Buah Tomat Merah Cincang + 1/2 Bawang Bombay + Paprika Merah',
      'Bumbu (Bubuk Jintan/Cumin, Bubuk Paprika, Bawang Putih, Lada, Garam)',
      '2 Lembar Roti Gandum Utuh Panggang'
    ],
    tools: ['Teflon Skillet Kecil', 'Spatula Kayu'],
    instructions: [
      'Tumis bawang bombay, paprika, dan tomat cincang hingga menjadi saus kental merah.',
      'Bumbui jintan, paprika bubuk, garam, dan lada.',
      'Buat 2 cekungan di saus tomat, pecahkan telur di dalamnya. Tutup teflon dan masak hingga putih telur matang setengah meleleh.',
      'Sajikan hangat langsung dari skillet bersama roti gandum panggang.'
    ]
  },
  {
    id: 'm37',
    name: 'Pad Thai Shirataki Udang (Thailand)',
    planCategory: 'fat_loss',
    mealTime: 'malam',
    calories: 350,
    protein: 34,
    carbs: 24,
    fat: 11,
    allergens: ['seafood', 'egg', 'nuts'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    description: 'Tumis mie shirataki khas Bangkok dengan udang kupas segar, tauge, telur orak-arik, dan perasan jeruk nipis.',
    ingredients: [
      '150g Mie Shirataki Pipih (seduh air panas)',
      '120g Udang Kupas Segar',
      '1 Butir Telur Orak-Arik',
      'Tauge Segar, Daun Kucai, & 1 sdm Kacang Tanah Sangrai Cincang',
      'Saus Pad Thai (1 sdm Asam Jawa, 1 sdm Kecap Ikan, 1 sdt Asli Gula Merah/Low-Sugar)'
    ],
    tools: ['Wok Pan / Teflon', 'Spatula'],
    instructions: [
      'Tumis udang kupas hingga berubah warna kemerahan.',
      'Sisihkan udang ke pinggir wok, masukan telur dan orak-arik.',
      'Masukkan mie shirataki, saus pad thai asam manis, tauge, dan kucai. Tumis cepat hingga harum.',
      'Taburi kacang sangrai cincang dan perasan jeruk nipis.'
    ]
  },
  {
    id: 'm38',
    name: 'Hawaiian Poke Bowl Tuna Lokal & Nasi Merah (Hawaii)',
    planCategory: 'muscle_gain',
    mealTime: 'siang',
    calories: 570,
    protein: 46,
    carbs: 60,
    fat: 15,
    allergens: ['seafood', 'soy'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Mangkuk segar Hawaiian poke bowl berisi dadu tuna grill matang ringan, alpukat, dan edamame.',
    ingredients: [
      '180g Fillet Ikan Tuna Segar Potong Dadu (Seared/Grill sebentar)',
      '1/3 Buah Alpukat Dadu & 50g Kacang Edamame Rebus Kupas',
      '1.5 sdm Saus Soy Wijen (Kecap Asin, Minyak Wijen, Bijian Wijen)',
      '120g Nasi Merah / Beras Hitam',
      'Rumput Laut Nori Iris'
    ],
    tools: ['Teflon Grill Seared', 'Mangkuk Poke Bowl'],
    instructions: [
      'Panggang (seared) dadu tuna di teflon sangat sebentar (1-2 menit) agar tetap juicy.',
      'Tata nasi merah di mangkuk, susun tuna dadu, alpukat, dan edamame di atasnya.',
      'Siram saus soy wijen dan taburi nori rumput laut garing.'
    ]
  },
  {
    id: 'm39',
    name: 'Salmon Grill Lemon Butter Low-Fat & Buncis (Western)',
    planCategory: 'muscle_gain',
    mealTime: 'malam',
    calories: 580,
    protein: 44,
    carbs: 42,
    fat: 22,
    allergens: ['seafood', 'dairy'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    description: 'Fillet ikan salmon kaya Omega-3 dipanggang garing kulitnya disiram saus perasan lemon segar.',
    ingredients: [
      '170g Fillet Ikan Salmon Segar',
      '1 sdt Butter/Mentega Unsalted + Perasan Lemon Segar',
      '100g Rebusan Buncis & Baby Potatoes (Kentang Kecil Panggang)',
      'Bawang Putih Cincang, Garam & Lada Hitam'
    ],
    tools: ['Teflon Anti-Lengket Pan', 'Capitan'],
    instructions: [
      'Bumbui fillet salmon dengan garam dan lada hitam.',
      'Panggang bagian kulit salmon terlebih dahulu di teflon hingga garing renyah (4 menit), balik dan masak 3 menit.',
      'Lelehkan 1 sdt butter dengan perasan lemon dan bawang putih, siram ke salmon.',
      'Sajikan bersama kentang panggang dan buncis.'
    ]
  },
  {
    id: 'm40',
    name: 'Bibimbap Nasi Merah & Telur Ceplok Air (Korea)',
    planCategory: 'fat_loss',
    mealTime: 'siang',
    calories: 450,
    protein: 28,
    carbs: 58,
    fat: 11,
    allergens: ['egg', 'soy'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    description: 'Mangkuk campur khas Korea berisi nasi merah, tumisan bayam, wortel, tauge, jamur, dan saus Gochujang.',
    ingredients: [
      '1 Butir Telur Ayam (Ceplok setengah matang / Poached)',
      'Sayuran Tumis Ringan (Bayam, Wortel Iris, Tauge, Jamur Tiram)',
      '100g Daging Ayam Cincang Tumis',
      '1 sdm Saus Gochujang / Sambal Korea Low-Sugar',
      '100g Nasi Merah'
    ],
    tools: ['Mangkuk Sajian Bibimbap', 'Teflon Tumis'],
    instructions: [
      'Tumis terpisah bayam, wortel, tauge, dan jamur dengan sedikit minyak wijen dan garam.',
      'Tata nasi merah hangat di mangkuk, susun sayuran tumis dan ayam cincang secara melingkar rapi.',
      'Beri telur ceplok di tengah dan 1 sdm saus Gochujang. Aduk rata sebelum dinikmati.'
    ]
  }
];

// Database Informasi Gizi Jajanan / Snack Populer Indonesia
const INDONESIAN_SNACKS_DATABASE = [
  { name: 'Bakpia Pathok (1 buah)', calories: 75, protein: 1.5, carbs: 13, fat: 2.2, portion: '1 Pcs (25g)', desc: 'Isi kacang hijau / cokelat' },
  { name: 'Roti Bakar Bandung (1 potong)', calories: 180, protein: 4.0, carbs: 28, fat: 6.0, portion: '1 Slice', desc: 'Dengan keju / cokelat' },
  { name: 'Pisang Goreng (1 buah)', calories: 140, protein: 1.2, carbs: 22, fat: 5.5, portion: '1 Pcs ukuran sedang', desc: 'Tepung goreng renyah' },
  { name: 'Tahu Isi / Gorengan (1 buah)', calories: 150, protein: 3.5, carbs: 14, fat: 9.0, portion: '1 Pcs', desc: 'Isi sayur / bihun goreng' },
  { name: 'Martabak Manis Cokelat Keju (1 potong)', calories: 290, protein: 5.5, carbs: 38, fat: 13.5, portion: '1 Slice sedang', desc: 'Mentega & keju manis' },
  { name: 'Es Cendol / Dawet (1 gelas)', calories: 240, protein: 2.0, carbs: 42, fat: 7.5, portion: '1 Gelas (250ml)', desc: 'Santan & gula merah' },
  { name: 'Keripik Singkong Balado (1 genggam)', calories: 160, protein: 1.0, carbs: 20, fat: 8.5, portion: '30 gram', desc: 'Renyah pedas gurih' },
  { name: 'Lemper Ayam (1 buah)', calories: 170, protein: 6.0, carbs: 24, fat: 5.0, portion: '1 Pcs bungkus daun', desc: 'Ketan & suwiran ayam' },
  { name: 'Bolu Kukus (1 buah)', calories: 130, protein: 2.5, carbs: 26, fat: 1.8, portion: '1 Pcs', desc: 'Tekstur lembut mekar' },
  { name: 'Alpukat Kocok / Avocado Shake', calories: 260, protein: 3.0, carbs: 25, fat: 16.0, portion: '1 Gelas (300ml)', desc: 'Alpukat matang & susu' },
  { name: 'Lumpia Semarang Goreng (1 buah)', calories: 190, protein: 6.5, carbs: 21, fat: 9.0, portion: '1 Pcs (70g)', desc: 'Isi rebung & telur/udang' },
  { name: 'Pempek Kapal Selam (1 buah)', calories: 340, protein: 16.0, carbs: 42, fat: 12.0, portion: '1 Pcs + Kuah Cuko', desc: 'Tepung sagu & telur utuh' },
  { name: 'Martabak Telur Daging (1 potong)', calories: 220, protein: 9.0, carbs: 16, fat: 14.0, portion: '1 Slice', desc: 'Kulit pastry & telur daging' },
  { name: 'Risoles Ragout Ayam (1 buah)', calories: 175, protein: 5.0, carbs: 18, fat: 9.5, portion: '1 Pcs', desc: 'Isi wortel ragout & ayam' },
  { name: 'Cilok Bumbu Kacang (5 butir)', calories: 210, protein: 3.0, carbs: 36, fat: 6.5, portion: '5 Butir', desc: 'Tepung aci & bumbu kacang' },
  { name: 'Batagor Bumbu Kacang (1 porsi)', calories: 380, protein: 12.0, carbs: 40, fat: 19.0, portion: '1 Porsi sedang', desc: 'Bakso tahu goreng & kacang' },
  { name: 'Klepon Ketan (3 buah)', calories: 135, protein: 1.5, carbs: 26, fat: 3.0, portion: '3 Pcs', desc: 'Isi gula merah & kelapa' },
  { name: 'Es Teler (1 gelas)', calories: 280, protein: 3.5, carbs: 46, fat: 9.5, portion: '1 Gelas', desc: 'Alpukat, nangka, kelapa, santan' }
];

// Database Olahraga Terstruktur & Familiar di Indonesia
const EXERCISES_DATABASE = [
  { 
    id: 'run_interval_400', 
    name: 'Lari Interval (400m x 10 Reps)', 
    category: 'cardio', 
    met: 10.5, 
    description: '10 set lari cepat 400 meter diselingi joging/jalan 90 detik recovery. Sangat efektif membakar lemak & meningkatkan VO2Max.',
    workoutStructure: ['Warm-up: Jogging santai 10 menit', 'Main Set: 10x (Lari cepat 400m + Jogging pemulihan 90 detik)', 'Cool-down: Jalan santai 5 menit & stretching leg']
  },
  { 
    id: 'run_interval_200', 
    name: 'Lari Sprint Interval (200m x 5 Reps)', 
    category: 'cardio', 
    met: 11.8, 
    description: 'Sesi sprint pendek eksplosif 200m sebanyak 5 putaran. Melatih kecepatan dan pembakaran kalori pasca-latihan (EPOC).',
    workoutStructure: ['Warm-up: Dynamic stretching & ABC Drills 10 menit', 'Main Set: 5x (Sprint 200m full speed + Jalan 2 menit)', 'Cool-down: Stretching statis']
  },
  { 
    id: 'run_easy_zone2', 
    name: 'Lari Santai Zone 2 (Easy Run 30-45m)', 
    category: 'cardio', 
    met: 8.0, 
    description: 'Lari santai di lapangan/GBK dengan ritme bernapas lancar. Fokus pada ketahanan jantung dan pemulihan otot.',
    workoutStructure: ['Warm-up: Jalan cepat 5 menit', 'Main Set: Lari konstan 35-45 menit (bisa sambil mengobrol)', 'Cool-down: Jalan santai 5 menit']
  },
  { 
    id: 'gym_chest_day', 
    name: 'Gym: Chest & Triceps Day', 
    category: 'strength', 
    met: 6.5, 
    description: 'Fokus melatih otot dada dan lengan belakang (Bench Press, Incline Dumbbell, Cable Fly, Triceps Pushdown).',
    workoutStructure: ['Flat Barbell Bench Press: 4 Set x 8-10 Reps', 'Incline Dumbbell Press: 3 Set x 10-12 Reps', 'Cable Chest Fly: 3 Set x 12-15 Reps', 'Triceps Rope Pushdown: 4 Set x 12 Reps']
  },
  { 
    id: 'gym_back_day', 
    name: 'Gym: Back & Biceps Day', 
    category: 'strength', 
    met: 6.5, 
    description: 'Fokus otot punggung lebar dan lengan depan (Lat Pulldown, Barbell Row, Deadlift, Biceps Barbell Curl).',
    workoutStructure: ['Lat Pulldown: 4 Set x 10-12 Reps', 'Bent-Over Barbell Row: 4 Set x 8-10 Reps', 'Seated Cable Row: 3 Set x 12 Reps', 'Biceps Barbell Curl: 3 Set x 12 Reps']
  },
  { 
    id: 'gym_leg_day', 
    name: 'Gym: Leg Day & Calves (Otot Kaki)', 
    category: 'strength', 
    met: 7.5, 
    description: 'Sesi intensif paha dan betis (Barbell Squat, Romanian Deadlift, Leg Press, Calf Raise). Pembakar kalori tertinggi di gym!',
    workoutStructure: ['Barbell Back Squat: 4 Set x 8-10 Reps', 'Leg Press Machine: 4 Set x 10-12 Reps', 'Romanian Deadlift (Hamstring): 3 Set x 10 Reps', 'Standing Calf Raise: 4 Set x 15 Reps']
  },
  { 
    id: 'swim_interval_50', 
    name: 'Renang Interval Speed (50m x 5 Reps)', 
    category: 'cardio', 
    met: 8.5, 
    description: 'Sprint 50 meter gaya bebas 5 kali putaran dengan istirahat 30 detik tiap ujung kolam.',
    workoutStructure: ['Warm-up: 100m gaya dada santai', 'Main Set: 5x (50m Gaya Bebas Cepat + Istirahat 30-45 detik)', 'Cool-down: 50m gaya punggung santai']
  },
  { 
    id: 'indo_futsal', 
    name: 'Futsal / Mini Soccer (Match 60m)', 
    category: 'sports', 
    met: 8.5, 
    description: 'Pertandingan futsal/mini soccer bersama teman. Banyak kombinasi sprint pendek dan kelincahan lapangan.',
    workoutStructure: ['Warm-up: Jogging & passing 10 menit', 'Main Game: 2 x 25 menit pertandingan interaktif', 'Cool-down: Light stretching']
  },
  { 
    id: 'indo_badminton', 
    name: 'Bulutangkis / Badminton (Ganda/Tunggal)', 
    category: 'sports', 
    met: 7.5, 
    description: 'Olahraga favorit masyarakat Indonesia. Melatih refleks otot kaki, bahu, dan daya tahan kardio.',
    workoutStructure: ['Warm-up: Footwork & pemanasan smes 10m', 'Main Match: 3 Game pertandingan 21 poin', 'Cool-down: Stretching bahu & pergelangan']
  }
];

// Inisialisasi Cloud Storage & Database Persistence
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'nutrisync-app';
let app = null, auth = null, db = null;

if (firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase Initialization Error:", e);
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState(null);
  const [showWaterResearchModal, setShowWaterResearchModal] = useState(false);
  const [selectedPlanCategory, setSelectedPlanCategory] = useState('all');

  // Deep Midnight Theme Style (Sporty Midnight Navy & Electric Lime)
  const themeStyle = {
    wrapper: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/70 via-[#070b19] to-[#03050c] text-slate-100',
    header: 'bg-[#0a0f24]/85 border-indigo-900/50 backdrop-blur-md text-white',
    cardBg: 'bg-[#0d132b]/75 border-indigo-900/40 text-slate-100',
    innerCard: 'bg-[#070b19]/90 border-indigo-900/40',
    textMuted: 'text-indigo-200/60',
    textTitle: 'text-white',
    inputBg: 'bg-[#070b19] border-indigo-900/50 text-white focus:border-lime-400 focus:outline-none'
  };

  // Cloud Storage Persistence State
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatusMessage, setSaveStatusMessage] = useState('');
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // Form states untuk snack & pencarian
  const [snackForm, setSnackForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [snackSearchTerm, setSnackSearchTerm] = useState('');

  // Form states untuk kalkulator olahraga
  const [selectedExerciseId, setSelectedExerciseId] = useState(EXERCISES_DATABASE[0]?.id || 'run_interval_400');
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [workoutRpe, setWorkoutRpe] = useState(7);
  const [workoutAvgHr, setWorkoutAvgHr] = useState('');
  const [workoutMaxHr, setWorkoutMaxHr] = useState('');
  const [workoutDistance, setWorkoutDistance] = useState('');

  // User profile & TDEE Calculator State
  const [user, setUser] = useState({
    name: 'Budi Santoso',
    age: 26,
    weight: 70, // kg
    height: 173, // cm
    gender: 'male', // male / female
    activityLevel: 1.375, // 1.2, 1.375, 1.55, 1.725
    goal: 'fat_loss', // fat_loss, muscle_gain, maintenance
  });

  // Calculate BMR, TDEE & BMI
  const calculateTDEE = () => {
    let bmr = 0;
    if (user.gender === 'male') {
      bmr = 10 * Number(user.weight) + 6.25 * Number(user.height) - 5 * Number(user.age) + 5;
    } else {
      bmr = 10 * Number(user.weight) + 6.25 * Number(user.height) - 5 * Number(user.age) - 161;
    }
    bmr = Math.round(bmr);
    const tdee = Math.round(bmr * Number(user.activityLevel));

    let targetCalories = tdee;
    let proteinPct = 0.3;
    let carbsPct = 0.4;
    let fatPct = 0.3;

    if (user.goal === 'fat_loss') {
      targetCalories = tdee - 400;
      proteinPct = 0.35;
      carbsPct = 0.35;
      fatPct = 0.30;
    } else if (user.goal === 'muscle_gain') {
      targetCalories = tdee + 350;
      proteinPct = 0.30;
      carbsPct = 0.50;
      fatPct = 0.20;
    }

    const proteinGrams = Math.round((targetCalories * proteinPct) / 4);
    const carbsGrams = Math.round((targetCalories * carbsPct) / 4);
    const fatGrams = Math.round((targetCalories * fatPct) / 9);

    // Calculate BMI (IMT)
    const heightInMeters = Number(user.height) / 100;
    const bmi = heightInMeters > 0 ? (Number(user.weight) / (heightInMeters * heightInMeters)).toFixed(1) : 0;
    let bmiCategory = 'Normal';
    if (bmi < 18.5) bmiCategory = 'Kurang (Underweight)';
    else if (bmi >= 25 && bmi < 29.9) bmiCategory = 'Kelebihan (Overweight)';
    else if (bmi >= 30) bmiCategory = 'Obesitas';

    return { bmr, tdee, targetCalories, proteinGrams, carbsGrams, fatGrams, bmi, bmiCategory };
  };

  const { bmr, tdee, targetCalories, proteinGrams, carbsGrams, fatGrams, bmi, bmiCategory } = calculateTDEE();

  // Intake Tracking State
  const [loggedMeals, setLoggedMeals] = useState([
    { id: 1, name: 'Sarapan: Omelet Putih Telur Sayuran & Oat', calories: 340, protein: 32, carbs: 30, fat: 8, type: 'catering' }
  ]);

  const [loggedWorkouts, setLoggedWorkouts] = useState([
    { id: 101, name: 'Lari Interval (400m x 10 Reps)', duration: 35, burned: 335, category: 'cardio', avgHr: 154, maxHr: 178, distance: 4.5, rpe: 8 }
  ]);

  const [waterMl, setWaterMl] = useState(1750);

  // 1. Firebase Auth Initializer
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Firebase auth error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Snapshot Listener (Load Cloud Saved Data)
  useEffect(() => {
    if (!currentUser || !db) return;

    const userDocRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profileData', 'current');
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.user) setUser(data.user);
        if (Array.isArray(data.loggedMeals)) setLoggedMeals(data.loggedMeals);
        if (Array.isArray(data.loggedWorkouts)) setLoggedWorkouts(data.loggedWorkouts);
        if (typeof data.waterMl === 'number') setWaterMl(data.waterMl);
        if (data.updatedAt) setLastSavedTime(data.updatedAt);
      }
    }, (error) => {
      console.error("Cloud storage sync error:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Handle Manual Save Data to Cloud
  const handleSaveData = async () => {
    setIsSaving(true);
    setSaveStatusMessage('');

    if (!currentUser || !db) {
      setTimeout(() => {
        setIsSaving(false);
        setSaveStatusMessage('Data tersimpan secara lokal di sesi ini.');
        setTimeout(() => setSaveStatusMessage(''), 3000);
      }, 500);
      return;
    }

    try {
      const userDocRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profileData', 'current');
      const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      await setDoc(userDocRef, {
        user,
        loggedMeals,
        loggedWorkouts,
        waterMl,
        updatedAt: nowStr
      }, { merge: true });
      
      setLastSavedTime(nowStr);
      setSaveStatusMessage('Data profil & riwayat konsumsi berhasil disimpan ke cloud! ✅');
    } catch (err) {
      console.error("Error saving data:", err);
      setSaveStatusMessage('Gagal menyimpan data ke server cloud.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatusMessage(''), 4000);
    }
  };

  // Total Calculations
  const totalCaloriesIn = loggedMeals.reduce((acc, curr) => acc + Number(curr.calories || 0), 0);
  const totalProteinIn = loggedMeals.reduce((acc, curr) => acc + Number(curr.protein || 0), 0);
  const totalCarbsIn = loggedMeals.reduce((acc, curr) => acc + Number(curr.carbs || 0), 0);
  const totalFatIn = loggedMeals.reduce((acc, curr) => acc + Number(curr.fat || 0), 0);
  const totalBurned = loggedWorkouts.reduce((acc, curr) => acc + Number(curr.burned || 0), 0);
  const netCalories = totalCaloriesIn - totalBurned;

  // Post-Workout Recovery Nutrient Calculation
  const recommendedPostWorkoutProtein = totalBurned > 0 ? Math.min(40, Math.max(15, Math.round(totalBurned * 0.06))) : 0;
  const recommendedPostWorkoutCarbs = totalBurned > 0 ? Math.min(65, Math.max(20, Math.round(totalBurned * 0.08))) : 0;
  const recommendedExtraWater = totalBurned > 0 ? Math.round((totalBurned / 200) * 250) : 0;

  // Scientific Water Target Formula
  const targetWaterMl = Math.round(Number(user.weight) * 35 + recommendedExtraWater);

  // Handlers
  const handleAddSnack = (e) => {
    e.preventDefault();
    if (!snackForm.name || !snackForm.calories) return;
    setLoggedMeals(prev => [
      ...prev,
      {
        id: Date.now(),
        name: snackForm.name,
        calories: Number(snackForm.calories),
        protein: Number(snackForm.protein || 0),
        carbs: Number(snackForm.carbs || 0),
        fat: Number(snackForm.fat || 0),
        type: 'snack'
      }
    ]);
    setSnackForm({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  const handleLogMealItem = (meal) => {
    setLoggedMeals(prev => [
      ...prev,
      {
        id: Date.now(),
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        type: 'catering'
      }
    ]);
  };

  const handleAddWorkout = (e) => {
    e.preventDefault();
    const ex = EXERCISES_DATABASE.find(item => item.id === selectedExerciseId);
    if (!ex) return;
    const durationHours = Number(workoutDuration) / 60;
    const burned = Math.round(ex.met * user.weight * durationHours);

    setLoggedWorkouts(prev => [
      ...prev,
      {
        id: Date.now(),
        name: ex.name,
        duration: Number(workoutDuration),
        burned: burned,
        category: ex.category,
        avgHr: Number(workoutAvgHr) || null,
        maxHr: Number(workoutMaxHr) || null,
        distance: workoutDistance ? Number(workoutDistance) : null,
        rpe: Number(workoutRpe) || 5
      }
    ]);
  };

  return (
    <div className={`min-h-screen ${themeStyle.wrapper} flex flex-col font-sans antialiased transition-colors duration-300`}>
      {/* HEADER / NAVIGATION */}
      <header className={`${themeStyle.header} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-lime-400/20">
                <Utensils className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <div>
                <span className={`text-xl font-black tracking-tight ${themeStyle.textTitle}`}>Nutri<span className="text-lime-400">Sync</span></span>
                <span className="hidden sm:inline-block ml-2 text-[10px] bg-lime-400/10 text-lime-400 px-2 py-0.5 rounded-full border border-lime-400/20 font-semibold">Nusantara</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-1 sm:space-x-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Activity },
                { id: 'recipes', label: 'Resep & Menu', icon: BookOpen },
                { id: 'tracker', label: 'Tracker Log', icon: Plus },
                { id: 'workout', label: 'Olahraga', icon: Dumbbell },
                { id: 'profile', label: 'Profil Saya', icon: User },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      active 
                        ? 'bg-lime-400/15 text-lime-400 border border-lime-400/30 shadow-sm shadow-lime-400/10' 
                        : 'text-indigo-200/60 hover:text-lime-400 hover:bg-indigo-900/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Profile & Target Banner */}
            <div className={`${themeStyle.cardBg} p-6 rounded-2xl border shadow-xl shadow-indigo-950/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-lime-400" />
                  <h2 className={`text-xl font-black ${themeStyle.textTitle}`}>Selamat Datang, {user.name} 👋</h2>
                </div>
                <p className={`${themeStyle.textMuted} text-xs`}>
                  {user.age} Thn • {user.gender === 'male' ? 'Pria' : 'Wanita'} • BB: <strong className={themeStyle.textTitle}>{user.weight} kg</strong> • TB: <strong className={themeStyle.textTitle}>{user.height} cm</strong> | Target: <strong className="text-lime-400 capitalize">{user.goal.replace('_', ' ')}</strong> ({targetCalories} kcal/hari)
                </p>
              </div>

              {/* Quick Macro Pills */}
              <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                <div className={`${themeStyle.innerCard} p-3 rounded-xl border text-center`}>
                  <span className={`text-[10px] ${themeStyle.textMuted} block font-bold`}>TARGET PROTEIN</span>
                  <strong className="text-sm text-rose-400">{proteinGrams}g</strong>
                </div>
                <div className={`${themeStyle.innerCard} p-3 rounded-xl border text-center`}>
                  <span className={`text-[10px] ${themeStyle.textMuted} block font-bold`}>TARGET KARBO</span>
                  <strong className="text-sm text-amber-400">{carbsGrams}g</strong>
                </div>
                <div className={`${themeStyle.innerCard} p-3 rounded-xl border text-center`}>
                  <span className={`text-[10px] ${themeStyle.textMuted} block font-bold`}>TARGET LEMAK</span>
                  <strong className="text-sm text-purple-400">{fatGrams}g</strong>
                </div>
              </div>
            </div>

            {/* DASHBOARD STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`${themeStyle.cardBg} p-4 rounded-xl border flex flex-col justify-between`}>
                <span className={`text-xs ${themeStyle.textMuted} font-medium`}>Asupan Masuk</span>
                <div className="mt-2 flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-lime-400">{totalCaloriesIn}</span>
                  <span className={`text-xs ${themeStyle.textMuted}`}>/ {targetCalories} kcal</span>
                </div>
                <div className="w-full bg-indigo-950 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-lime-400 h-full rounded-full" style={{ width: `${Math.min(100, (totalCaloriesIn / targetCalories) * 100)}%` }}></div>
                </div>
              </div>

              <div className={`${themeStyle.cardBg} p-4 rounded-xl border flex flex-col justify-between`}>
                <span className={`text-xs ${themeStyle.textMuted} font-medium`}>Kalori Terbakar</span>
                <div className="mt-2 flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-amber-400">{totalBurned}</span>
                  <span className={`text-xs ${themeStyle.textMuted}`}>kcal</span>
                </div>
                <div className={`text-[10px] ${themeStyle.textMuted} mt-2`}>Dari {loggedWorkouts.length} sesi olahraga</div>
              </div>

              <div className={`${themeStyle.cardBg} p-4 rounded-xl border flex flex-col justify-between`}>
                <span className={`text-xs ${themeStyle.textMuted} font-medium`}>Net Kalori</span>
                <div className="mt-2 flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-cyan-400">{netCalories}</span>
                  <span className={`text-xs ${themeStyle.textMuted}`}>kcal</span>
                </div>
                <div className={`text-[10px] ${themeStyle.textMuted} mt-2`}>Masuk - Terbakar</div>
              </div>

              <div className={`${themeStyle.cardBg} p-4 rounded-xl border flex flex-col justify-between`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${themeStyle.textMuted} font-medium`}>Air Mineral</span>
                  <button
                    onClick={() => setShowWaterResearchModal(true)}
                    className="text-[10px] text-sky-400 hover:text-sky-300 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 flex items-center space-x-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>Riset</span>
                  </button>
                </div>
                <div className="mt-2 flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-sky-400">{waterMl}</span>
                  <span className={`text-xs ${themeStyle.textMuted}`}>/ {targetWaterMl} ml</span>
                </div>
                <div className="w-full bg-indigo-950 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full" style={{ width: `${Math.min(100, (waterMl / targetWaterMl) * 100)}%` }}></div>
                </div>
              </div>
            </div>

            {/* Post-Workout Recovery Card */}
            {totalBurned > 0 && (
              <div className={`${themeStyle.cardBg} border-amber-400/40 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Rekomendasi Pemulihan Pasca-Olahraga</span>
                  </div>
                  <p className={`text-xs ${themeStyle.textMuted}`}>
                    Setelah membakar <strong className="text-amber-400">{totalBurned} kcal</strong>, tubuh butuh ekstra <strong>+{recommendedPostWorkoutProtein}g Protein</strong>, <strong>+{recommendedPostWorkoutCarbs}g Karbohidrat</strong>, dan <strong>+{recommendedExtraWater}ml Air</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setLoggedMeals(prev => [...prev, { id: Date.now(), name: 'Post-Workout Recovery Shake/Snack', calories: Math.round(recommendedPostWorkoutProtein * 4 + recommendedPostWorkoutCarbs * 4), protein: recommendedPostWorkoutProtein, carbs: recommendedPostWorkoutCarbs, fat: 2, type: 'snack' }])}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl whitespace-nowrap transition"
                >
                  + Catat Recovery Snack
                </button>
              </div>
            )}

            {/* Rekomendasi Menu 3x Makan Sehari */}
            <div className={`${themeStyle.cardBg} p-6 rounded-2xl border space-y-4`}>
              <h3 className={`text-base font-bold ${themeStyle.textTitle} flex items-center space-x-2`}>
                <Sparkles className="w-5 h-5 text-lime-400" />
                <span>Rekomendasi Menu 3 Kali Makan Sehari ({user.goal.replace('_', ' ').toUpperCase()})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['pagi', 'siang', 'malam'].map((time) => {
                  const meal = INITIAL_MEALS_CATALOG.find(m => m.mealTime === time && (m.planCategory === user.goal || m.planCategory === 'fat_loss')) || INITIAL_MEALS_CATALOG[0];
                  return (
                    <div key={time} className={`${themeStyle.innerCard} p-4 rounded-xl border flex flex-col justify-between space-y-3`}>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
                            Makan {time}
                          </span>
                          <span className={`text-xs ${themeStyle.textMuted} font-semibold`}>{meal.calories} kcal</span>
                        </div>
                        <h4 className={`font-bold ${themeStyle.textTitle} text-sm line-clamp-1`}>{meal.name}</h4>
                        <p className={`text-xs ${themeStyle.textMuted} mt-1 line-clamp-2`}>{meal.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLogMealItem(meal)}
                          className="flex-1 py-1.5 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 text-xs font-bold rounded-lg border border-lime-400/30 transition"
                        >
                          + Catat
                        </button>
                        <button
                          onClick={() => setSelectedRecipeDetail(meal)}
                          className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-100 text-xs font-bold rounded-lg border border-indigo-800/60 transition"
                        >
                          Resep
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RECIPES */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className={`text-xl font-black ${themeStyle.textTitle} flex items-center space-x-2`}>
                  <BookOpen className="w-6 h-6 text-lime-400" />
                  <span>Katalog Resep & Panduan Masak Sehat Nusantara</span>
                </h2>
                <p className={`${themeStyle.textMuted} text-sm mt-1`}>
                  Pelajari bahan baku rumahan Indonesia, peralatan masak yang dibutuhkan, serta langkah memasak bernutrisi presisi.
                </p>
              </div>

              {/* Goal Filter Pills */}
              <div className="flex space-x-2">
                {[
                  { id: 'fat_loss', label: 'Fat Loss' },
                  { id: 'muscle_gain', label: 'Muscle Gain' },
                  { id: 'all', label: 'Semua Menu' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedPlanCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedPlanCategory === cat.id
                        ? 'bg-lime-400 text-slate-950 shadow-md shadow-lime-400/20'
                        : `${themeStyle.cardBg} ${themeStyle.textMuted} hover:text-white`
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_MEALS_CATALOG.filter(m => selectedPlanCategory === 'all' || m.planCategory === selectedPlanCategory).map(meal => (
                <div key={meal.id} className={`${themeStyle.cardBg} border rounded-2xl overflow-hidden hover:border-lime-400/50 transition flex flex-col justify-between shadow-lg shadow-indigo-950/30`}>
                  <div>
                    <img src={meal.image} alt={meal.name} className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
                          {meal.mealTime} • {meal.planCategory.replace('_', ' ')}
                        </span>
                        <span className={`text-xs font-bold ${themeStyle.textTitle}`}>{meal.calories} kcal</span>
                      </div>
                      <h3 className={`font-bold ${themeStyle.textTitle} text-sm`}>{meal.name}</h3>
                      <p className={`text-xs ${themeStyle.textMuted} line-clamp-2`}>{meal.description}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => setSelectedRecipeDetail(meal)}
                      className="flex-1 py-2 bg-indigo-950 hover:bg-indigo-900 text-indigo-100 text-xs font-bold rounded-xl border border-indigo-800/60 transition"
                    >
                      Bahan & Cara Masak
                    </button>
                    <button
                      onClick={() => handleLogMealItem(meal)}
                      className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold rounded-xl transition"
                    >
                      + Catat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TRACKER LOG */}
        {activeTab === 'tracker' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Custom Snack Form */}
              <div className={`${themeStyle.cardBg} p-5 rounded-2xl border space-y-4`}>
                <h3 className={`text-base font-bold ${themeStyle.textTitle} flex items-center space-x-2`}>
                  <Plus className="w-5 h-5 text-lime-400" />
                  <span>Tambah Log Makanan / Snack Kustom</span>
                </h3>
                <form onSubmit={handleAddSnack} className="space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="Nama makanan / snack"
                    value={snackForm.name}
                    onChange={e => setSnackForm({ ...snackForm, name: e.target.value })}
                    className={`w-full ${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="number"
                      placeholder="Kalori (kcal)"
                      value={snackForm.calories}
                      onChange={e => setSnackForm({ ...snackForm, calories: e.target.value })}
                      className={`${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                    />
                    <input
                      type="number"
                      placeholder="Prot (g)"
                      value={snackForm.protein}
                      onChange={e => setSnackForm({ ...snackForm, protein: e.target.value })}
                      className={`${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                    />
                    <input
                      type="number"
                      placeholder="Karbo (g)"
                      value={snackForm.carbs}
                      onChange={e => setSnackForm({ ...snackForm, carbs: e.target.value })}
                      className={`${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                    />
                    <input
                      type="number"
                      placeholder="Lemak (g)"
                      value={snackForm.fat}
                      onChange={e => setSnackForm({ ...snackForm, fat: e.target.value })}
                      className={`${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold rounded-xl transition">
                    Simpan Ke Log Makanan
                  </button>
                </form>
              </div>

              {/* Quick Add Snack Database */}
              <div className={`${themeStyle.cardBg} p-5 rounded-2xl border space-y-3`}>
                <h3 className={`text-sm font-bold ${themeStyle.textTitle} flex items-center space-x-2`}>
                  <Search className="w-4 h-4 text-lime-400" />
                  <span>Katalog Gizi Jajanan Indonesia</span>
                </h3>
                <input
                  type="text"
                  placeholder="Cari jajanan (bakpia, martabak, gorengan...)"
                  value={snackSearchTerm}
                  onChange={e => setSnackSearchTerm(e.target.value)}
                  className={`w-full ${themeStyle.inputBg} rounded-xl px-3 py-2 text-xs border`}
                />
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {INDONESIAN_SNACKS_DATABASE.filter(s => s.name.toLowerCase().includes(snackSearchTerm.toLowerCase())).map((snack, idx) => (
                    <div key={idx} className={`${themeStyle.innerCard} p-3 rounded-xl border flex justify-between items-center text-xs`}>
                      <div>
                        <div className={`font-bold ${themeStyle.textTitle}`}>{snack.name}</div>
                        <div className={`text-[10px] ${themeStyle.textMuted}`}>{snack.portion} • {snack.calories} kcal | P:{snack.protein}g K:{snack.carbs}g L:{snack.fat}g</div>
                      </div>
                      <button
                        onClick={() => setLoggedMeals(prev => [...prev, { id: Date.now(), name: snack.name, calories: snack.calories, protein: snack.protein, carbs: snack.carbs, fat: snack.fat, type: 'snack' }])}
                        className="px-3 py-1 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 border border-lime-400/30 rounded-lg text-xs font-bold"
                      >
                        + Catat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logged Meals List & Hydration */}
            <div className="space-y-6">
              <div className={`${themeStyle.cardBg} p-5 rounded-2xl border space-y-3`}>
                <h3 className={`text-base font-bold ${themeStyle.textTitle} flex items-center space-x-2`}>
                  <Utensils className="w-5 h-5 text-lime-400" />
                  <span>Riwayat Konsumsi Makanan Hari Ini</span>
                </h3>
                {loggedMeals.length === 0 ? (
                  <p className={`text-xs ${themeStyle.textMuted} italic py-4`}>Belum ada makanan yang dicatat hari ini.</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {loggedMeals.map(item => (
                      <div key={item.id} className={`${themeStyle.innerCard} p-3 rounded-xl border flex justify-between items-center text-xs`}>
                        <div>
                          <div className={`font-bold ${themeStyle.textTitle}`}>{item.name}</div>
                          <div className={`text-[10px] ${themeStyle.textMuted}`}>{item.calories} kcal • P:{item.protein}g K:{item.carbs}g L:{item.fat}g</div>
                        </div>
                        <button
                          onClick={() => setLoggedMeals(prev => prev.filter(m => m.id !== item.id))}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Water Intake Tracker */}
              <div className={`${themeStyle.cardBg} p-5 rounded-2xl border space-y-3`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`text-sm font-bold ${themeStyle.textTitle} flex items-center space-x-2`}>
                      <Droplets className="w-4 h-4 text-sky-400" />
                      <span>Asupan Air Mineral</span>
                    </h3>
                    <p className={`text-[10px] ${themeStyle.textMuted} mt-0.5`}>
                      Target Ilmiah: {user.weight}kg × 35ml {recommendedExtraWater > 0 ? `+ ${recommendedExtraWater}ml (Olahraga)` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowWaterResearchModal(true)}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-xl border border-sky-500/20 flex items-center space-x-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Riset Sains</span>
                  </button>
                </div>

                <div className={`${themeStyle.innerCard} p-3 rounded-xl border flex justify-between items-center`}>
                  <span className={`text-xs ${themeStyle.textMuted} font-semibold`}>Total Terpenuhi:</span>
                  <span className="text-sm font-black text-sky-400">{waterMl} / {targetWaterMl} ml</span>
                </div>

                <div className="flex gap-2">
                  {[250, 500, 600].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setWaterMl(prev => prev + amt)}
                      className="flex-1 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold rounded-xl text-xs transition"
                    >
                      +{amt} ml
                    </button>
                  ))}
                  <button
                    onClick={() => setWaterMl(0)}
                    className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold rounded-xl text-xs transition"
                    title="Reset Air"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WORKOUT */}
        {activeTab === 'workout' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${themeStyle.cardBg} p-5 rounded-2xl border space-y-4`}>
              <h3 className={`text-lg font-bold ${themeStyle.textTitle} flex items-center space-x-2`}>
                <Dumbbell className="w-5 h-5 text-amber-400" />
                <span>Kalkulator & Program Latihan Detail</span>
              </h3>

              <form onSubmit={handleAddWorkout} className="space-y-4 text-xs">
                <div>
                  <label className={`${themeStyle.textMuted} block mb-1`}>Pilih Program & Sesi Olahraga</label>
                  <select
                    value={selectedExerciseId}
                    onChange={e => setSelectedExerciseId(e.target.value)}
                    className={`w-full ${themeStyle.inputBg} rounded-xl px-3 py-2 font-medium border`}
                  >
                    {EXERCISES_DATABASE.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name} (MET: {ex.met})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`${themeStyle.textMuted} block mb-1`}>Durasi (Menit)</label>
                    <input
                      type="number"
                      value={workoutDuration}
                      onChange={e => setWorkoutDuration(e.target.value)}
                      className={`w-full ${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                    />
                  </div>
                  <div>
                    <label className={`${themeStyle.textMuted} block mb-1`}>Skala RPE (1-10 Intensitas)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={workoutRpe}
                      onChange={e => setWorkoutRpe(e.target.value)}
                      className={`w-full ${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={`${themeStyle.textMuted} block mb-1`}>Rata BPM (Avg HR)</label>
                    <input
                      type="number"
                      placeholder="145"
                      value={workoutAvgHr}
                      onChange={e => setWorkoutAvgHr(e.target.value)}
                      className={`w-full ${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                    />
                  </div>
                  <div>
                    <label className={`${themeStyle.textMuted} block mb-1`}>Max BPM (Max HR)</label>
                    <input
                      type="number"
                      placeholder="170"
                      value={workoutMaxHr}
                      onChange={e => setWorkoutMaxHr(e.target.value)}
                      className={`w-full ${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                    />
                  </div>
                  <div>
                    <label className={`${themeStyle.textMuted} block mb-1`}>Jarak (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="5.0"
                      value={workoutDistance}
                      onChange={e => setWorkoutDistance(e.target.value)}
                      className={`w-full ${themeStyle.inputBg} rounded-xl px-3 py-2 border`}
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition">
                  + Catat Sesi Olahraga
                </button>
              </form>

              {/* Selected Program Structure */}
              {(() => {
                const ex = EXERCISES_DATABASE.find(item => item.id === selectedExerciseId);
                if (!ex) return null;
                return (
                  <div className={`${themeStyle.innerCard} p-4 rounded-xl border space-y-2 text-xs`}>
                    <h4 className="font-bold text-amber-400">{ex.name}</h4>
                    <p className={themeStyle.textMuted}>{ex.description}</p>
                    <div className="pt-2 border-t border-indigo-900/50">
                      <span className={`font-bold ${themeStyle.textTitle} block mb-1`}>Struktur Sesi Latihan:</span>
                      <ul className={`space-y-1 ${themeStyle.textMuted} list-disc list-inside`}>
                        {ex.workoutStructure.map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Logged Workouts List */}
            <div className={`${themeStyle.cardBg} p-5 rounded-2xl border space-y-4`}>
              <h3 className={`text-base font-bold ${themeStyle.textTitle} flex items-center space-x-2`}>
                <Activity className="w-5 h-5 text-amber-400" />
                <span>Riwayat Olahraga Hari Ini</span>
              </h3>
              {loggedWorkouts.length === 0 ? (
                <p className={`text-xs ${themeStyle.textMuted} italic py-4`}>Belum ada olahraga yang dicatat hari ini.</p>
              ) : (
                <div className="space-y-3 max-h-[450px] overflow-y-auto">
                  {loggedWorkouts.map(w => (
                    <div key={w.id} className={`${themeStyle.innerCard} p-4 rounded-xl border space-y-2 text-xs`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-bold ${themeStyle.textTitle}`}>{w.name}</h4>
                          <span className="text-[10px] text-amber-400 font-semibold">{w.duration} menit • {w.burned} kcal burned</span>
                        </div>
                        <button
                          onClick={() => setLoggedWorkouts(prev => prev.filter(item => item.id !== w.id))}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 bg-indigo-950/60 p-2 rounded-lg text-center text-[10px] border border-indigo-900/40">
                        <div><span className={`${themeStyle.textMuted} block`}>Avg/Max HR</span><strong className="text-rose-400">{w.avgHr || '-'} / {w.maxHr || '-'} BPM</strong></div>
                        <div><span className={`${themeStyle.textMuted} block`}>Jarak</span><strong className="text-cyan-400">{w.distance ? `${w.distance} km` : '-'}</strong></div>
                        <div><span className={`${themeStyle.textMuted} block`}>RPE Intensitas</span><strong className="text-amber-400">{w.rpe} / 10</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: MENU PROFIL SAYA (USER PROFILE & METRICS) */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Form Edit Profil */}
            <div className={`md:col-span-2 ${themeStyle.cardBg} border rounded-2xl p-6 shadow-xl shadow-indigo-950/30 space-y-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-900/40 pb-4 gap-4">
                <div>
                  <h2 className={`text-xl font-black ${themeStyle.textTitle} flex items-center space-x-2`}>
                    <User className="w-6 h-6 text-lime-400" />
                    <span>Profil Saya & Pengaturan Biometrik</span>
                  </h2>
                  <p className={`${themeStyle.textMuted} text-xs mt-1`}>
                    Ubah usia, jenis kelamin, berat badan, dan tinggi badan untuk menghitung target energi harian secara otomatis.
                  </p>
                </div>

                {/* Tombol Simpan Data Persistence */}
                <button
                  onClick={handleSaveData}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-gradient-to-r from-lime-400 to-cyan-400 hover:from-lime-300 hover:to-cyan-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-lime-400/20 disabled:opacity-50 whitespace-nowrap"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Data Profil</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Banner Notifikasi Simpan Data */}
              {saveStatusMessage && (
                <div className="bg-indigo-950/80 border border-lime-400/40 p-3 rounded-xl flex items-center space-x-2 text-lime-300 text-xs animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0" />
                  <span>{saveStatusMessage}</span>
                </div>
              )}

              {/* Informasi Cloud Status */}
              <div className={`${themeStyle.innerCard} p-3 rounded-xl border flex items-center justify-between text-xs`}>
                <div className="flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  <span className={`${themeStyle.textMuted} font-medium`}>Status Cloud Sync:</span>
                  <span className="text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20 text-[10px]">
                    {currentUser ? 'Tersambung (Cloud Storage Aktif)' : 'Mode Sesi Lokal'}
                  </span>
                </div>
                {lastSavedTime && (
                  <span className={`${themeStyle.textMuted} text-[10px]`}>Terakhir disimpan: {lastSavedTime}</span>
                )}
              </div>

              <div className="space-y-4 text-xs">
                {/* Nama Lengkap */}
                <div>
                  <label className={`${themeStyle.textTitle} font-bold block mb-1`}>Nama Lengkap</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className={`w-full ${themeStyle.inputBg} rounded-xl px-4 py-2.5 font-medium border`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Usia */}
                  <div>
                    <label className={`${themeStyle.textTitle} font-bold block mb-1`}>Usia (Tahun)</label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={user.age}
                      onChange={(e) => setUser({ ...user, age: Number(e.target.value) })}
                      className={`w-full ${themeStyle.inputBg} rounded-xl px-4 py-2.5 font-semibold border`}
                    />
                  </div>

                  {/* Jenis Kelamin / Gender */}
                  <div>
                    <label className={`${themeStyle.textTitle} font-bold block mb-1`}>Jenis Kelamin (Gender)</label>
                    <select
                      value={user.gender}
                      onChange={(e) => setUser({ ...user, gender: e.target.value })}
                      className={`w-full ${themeStyle.inputBg} rounded-xl px-4 py-2.5 font-semibold border`}
                    >
                      <option value="male">👨 Pria (Male)</option>
                      <option value="female">👩 Wanita (Female)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Berat Badan (BB) */}
                  <div>
                    <label className={`${themeStyle.textTitle} font-bold block mb-1`}>Berat Badan / BB (kg)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="30"
                        max="250"
                        value={user.weight}
                        onChange={(e) => setUser({ ...user, weight: Number(e.target.value) })}
                        className={`w-full ${themeStyle.inputBg} rounded-xl px-4 py-2.5 text-lime-400 font-bold text-sm border`}
                      />
                      <span className="absolute right-3 top-2.5 text-indigo-300/60 font-bold text-xs">kg</span>
                    </div>
                  </div>

                  {/* Tinggi Badan (TB) */}
                  <div>
                    <label className={`${themeStyle.textTitle} font-bold block mb-1`}>Tinggi Badan / TB (cm)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="100"
                        max="250"
                        value={user.height}
                        onChange={(e) => setUser({ ...user, height: Number(e.target.value) })}
                        className={`w-full ${themeStyle.inputBg} rounded-xl px-4 py-2.5 text-cyan-400 font-bold text-sm border`}
                      />
                      <span className="absolute right-3 top-2.5 text-indigo-300/60 font-bold text-xs">cm</span>
                    </div>
                  </div>
                </div>

                {/* Tingkat Aktivitas Harian */}
                <div>
                  <label className={`${themeStyle.textTitle} font-bold block mb-1`}>Tingkat Aktivitas Harian</label>
                  <select
                    value={user.activityLevel}
                    onChange={(e) => setUser({ ...user, activityLevel: Number(e.target.value) })}
                    className={`w-full ${themeStyle.inputBg} rounded-xl px-4 py-2.5 font-medium border`}
                  >
                    <option value={1.2}>Sedentary (Jarang / Tidak Pernah Olahraga)</option>
                    <option value={1.375}>Ringan (Olahraga 1-3 hari / minggu)</option>
                    <option value={1.55}>Sedang (Olahraga 3-5 hari / minggu)</option>
                    <option value={1.725}>Tinggi / Berat (Olahraga 6-7 hari / minggu)</option>
                  </select>
                </div>

                {/* Target Kesehatan / Fitness Goal */}
                <div>
                  <label className={`${themeStyle.textTitle} font-bold block mb-1`}>Target Kesehatan (Fitness Goal)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'fat_loss', title: 'Fat Loss', desc: 'Defisit Kalori' },
                      { id: 'maintenance', title: 'Maintenance', desc: 'Jaga Berat' },
                      { id: 'muscle_gain', title: 'Muscle Gain', desc: 'Surplus Protein' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setUser({ ...user, goal: g.id })}
                        className={`p-3 rounded-xl border text-center transition ${
                          user.goal === g.id
                            ? 'bg-lime-400/10 border-lime-400 text-lime-400 font-bold'
                            : `${themeStyle.innerCard} ${themeStyle.textMuted} hover:text-white`
                        }`}
                      >
                        <div className="text-xs">{g.title}</div>
                        <div className="text-[10px] text-indigo-300/50 mt-0.5">{g.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Ringkasan Biometrik & TDEE */}
            <div className="space-y-6">
              <div className={`${themeStyle.cardBg} border rounded-2xl p-6 shadow-xl shadow-indigo-950/30 space-y-4`}>
                <h3 className={`text-lg font-bold ${themeStyle.textTitle} flex items-center space-x-2 border-b border-indigo-900/40 pb-3`}>
                  <Activity className="w-5 h-5 text-lime-400" />
                  <span>Kalkulasi Biometrik Anda</span>
                </h3>

                <div className="space-y-3">
                  {/* Indeks Massa Tubuh (BMI) */}
                  <div className={`${themeStyle.innerCard} p-4 rounded-xl border flex justify-between items-center`}>
                    <div>
                      <span className={`text-[10px] ${themeStyle.textMuted} block font-bold`}>INDEKS MASSA TUBUH (BMI)</span>
                      <strong className="text-2xl font-black text-cyan-400">{bmi}</strong>
                    </div>
                    <span className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 px-2.5 py-1 rounded-lg font-bold">
                      {bmiCategory}
                    </span>
                  </div>

                  {/* BMR */}
                  <div className={`${themeStyle.innerCard} p-4 rounded-xl border flex justify-between items-center`}>
                    <div>
                      <span className={`text-[10px] ${themeStyle.textMuted} block font-bold`}>BMR (METABOLISME BASAL)</span>
                      <strong className={`text-xl font-bold ${themeStyle.textTitle}`}>{bmr} <span className={`text-xs font-normal ${themeStyle.textMuted}`}>kcal/hari</span></strong>
                    </div>
                    <span className={`text-[10px] ${themeStyle.textMuted} text-right max-w-[100px]`}>Energi minim organ tubuh saat istirahat</span>
                  </div>

                  {/* TDEE */}
                  <div className={`${themeStyle.innerCard} p-4 rounded-xl border flex justify-between items-center`}>
                    <div>
                      <span className={`text-[10px] ${themeStyle.textMuted} block font-bold`}>TDEE (TOTAL ENERGI HARIAN)</span>
                      <strong className="text-xl font-bold text-amber-400">{tdee} <span className={`text-xs font-normal ${themeStyle.textMuted}`}>kcal/hari</span></strong>
                    </div>
                    <span className={`text-[10px] ${themeStyle.textMuted} text-right max-w-[100px]`}>Kalori terbakar sesuai tingkat aktivitas</span>
                  </div>

                  {/* Target Harian Sesuai Goal */}
                  <div className="bg-indigo-950/60 p-4 rounded-xl border border-lime-400/30 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-lime-400 block font-bold">TARGET KALORI HARIAN</span>
                      <strong className="text-2xl font-black text-lime-400">{targetCalories} <span className="text-xs font-normal opacity-80">kcal</span></strong>
                    </div>
                    <span className="text-[10px] text-lime-400 font-semibold bg-lime-400/10 px-2 py-1 rounded border border-lime-400/20 capitalize">
                      {user.goal.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rincian Gramasi Makronutrisi */}
              <div className={`${themeStyle.cardBg} border rounded-2xl p-6 shadow-xl shadow-indigo-950/30 space-y-3`}>
                <h4 className={`text-sm font-bold ${themeStyle.textTitle} flex items-center space-x-2`}>
                  <Target className="w-4 h-4 text-lime-400" />
                  <span>Target Makronutrisi Harian:</span>
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className={`${themeStyle.innerCard} p-3 rounded-xl border`}>
                    <span className={`text-[10px] ${themeStyle.textMuted} block`}>Protein</span>
                    <strong className="text-rose-400 text-base font-black">{proteinGrams}g</strong>
                    <span className={`text-[9px] ${themeStyle.textMuted} block mt-0.5`}>({proteinGrams * 4} kcal)</span>
                  </div>
                  <div className={`${themeStyle.innerCard} p-3 rounded-xl border`}>
                    <span className={`text-[10px] ${themeStyle.textMuted} block`}>Karbohidrat</span>
                    <strong className="text-amber-400 text-base font-black">{carbsGrams}g</strong>
                    <span className={`text-[9px] ${themeStyle.textMuted} block mt-0.5`}>({carbsGrams * 4} kcal)</span>
                  </div>
                  <div className={`${themeStyle.innerCard} p-3 rounded-xl border`}>
                    <span className={`text-[10px] ${themeStyle.textMuted} block`}>Lemak</span>
                    <strong className="text-purple-400 text-base font-black">{fatGrams}g</strong>
                    <span className={`text-[9px] ${themeStyle.textMuted} block mt-0.5`}>({fatGrams * 9} kcal)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL & FOOTER */}
      {selectedRecipeDetail && (
        <div className="fixed inset-0 bg-[#03050c]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d132b] border border-indigo-900/60 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-indigo-900/50 pb-4">
              <div>
                <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
                  Panduan Masak Nusantara
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{selectedRecipeDetail.name}</h3>
              </div>
              <button onClick={() => setSelectedRecipeDetail(null)} className="text-indigo-200/60 hover:text-white font-bold text-base">✕</button>
            </div>

            <div className="space-y-6 text-xs">
              {/* Macro Info */}
              <div className="grid grid-cols-4 gap-2 bg-[#070b19] p-3 rounded-xl border border-indigo-900/50 text-center">
                <div>
                  <span className="text-indigo-200/60 block text-[10px]">Kalori Total</span>
                  <strong className="text-white text-sm">{selectedRecipeDetail.calories} kcal</strong>
                </div>
                <div>
                  <span className="text-indigo-200/60 block text-[10px]">Protein</span>
                  <strong className="text-rose-400 text-sm">{selectedRecipeDetail.protein}g</strong>
                </div>
                <div>
                  <span className="text-indigo-200/60 block text-[10px]">Karbohidrat</span>
                  <strong className="text-amber-400 text-sm">{selectedRecipeDetail.carbs}g</strong>
                </div>
                <div>
                  <span className="text-indigo-200/60 block text-[10px]">Lemak Sehat</span>
                  <strong className="text-purple-400 text-sm">{selectedRecipeDetail.fat}g</strong>
                </div>
              </div>

              {/* Bahan-Bahan */}
              <div>
                <h4 className="font-bold text-slate-200 text-sm mb-2 flex items-center space-x-2">
                  <Utensils className="w-4 h-4 text-lime-400" />
                  <span>Bahan-Bahan Yang Dibutuhkan:</span>
                </h4>
                <ul className="bg-indigo-950/50 p-3.5 rounded-xl border border-indigo-900/50 space-y-1.5">
                  {selectedRecipeDetail.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-slate-200">
                      <CheckSquare className="w-3.5 h-3.5 text-lime-400 flex-shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alat Masak Yang Dibutuhkan */}
              <div>
                <h4 className="font-bold text-slate-200 text-sm mb-2 flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Peralatan Masak:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipeDetail.tools.map((tool, idx) => (
                    <span key={idx} className="bg-indigo-950/80 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-lg font-medium text-[11px]">
                      🍳 {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cara Memasak Step-by-Step */}
              <div>
                <h4 className="font-bold text-slate-200 text-sm mb-2 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Langkah-Langkah Memasak:</span>
                </h4>
                <ol className="bg-indigo-950/50 p-4 rounded-xl border border-indigo-900/50 space-y-3">
                  {selectedRecipeDetail.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => {
                    handleLogMealItem(selectedRecipeDetail);
                    setSelectedRecipeDetail(null);
                  }}
                  className="flex-1 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs shadow-lg shadow-lime-400/20"
                >
                  Catat Ke Tracker Konsumsi Harian
                </button>
                <button 
                  onClick={() => setSelectedRecipeDetail(null)}
                  className="px-4 py-2.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-100 border border-indigo-800/60 font-bold rounded-xl text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RISET & SAINS HIDRASI */}
      {showWaterResearchModal && (
        <div className="fixed inset-0 bg-[#03050c]/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d132b] border border-indigo-900/60 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-indigo-900/50 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Riset & Sains Hidrasi Air Mineral</h3>
                  <span className="text-[10px] text-sky-400 font-semibold">Berdasarkan Studi EFSA, ACSM & J Clin Endocrinol Metab</span>
                </div>
              </div>
              <button onClick={() => setShowWaterResearchModal(false)} className="text-indigo-200/60 hover:text-white font-bold text-base">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Rumus Ilmiah NutriSync */}
              <div className="bg-indigo-950/70 p-4 rounded-xl border border-sky-500/30 space-y-1">
                <span className="text-[10px] text-sky-300 font-bold tracking-wider uppercase block">FORMULA ILMIAH TARGET AIR ANDA</span>
                <div className="text-sm font-black text-white">
                  ({user.weight} kg × 35 ml) {recommendedExtraWater > 0 ? `+ ${recommendedExtraWater} ml (Kompensasi Olahraga)` : ''} = <span className="text-sky-400">{targetWaterMl} ml/hari</span>
                </div>
                <p className="text-[11px] text-indigo-100/80 mt-1">
                  Standard EFSA (European Food Safety Authority) menetapkan kebutuhan hidrasi harian adalah 30-35 ml per kg berat badan dewasa, ditambah kompensasi 250ml per 200 kcal yang terbakar dari olahraga.
                </p>
              </div>

              {/* Poin Riset Studi */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 text-xs flex items-center space-x-1.5">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span>4 Bukti Ilmiah Pentingnya Hidrasi:</span>
                </h4>

                <div className="bg-[#070b19] p-3.5 rounded-xl border border-indigo-900/50 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-lime-400 font-bold">1. Meningkatkan Laju Metabolisme & Fat Loss (+30%)</strong>
                    <span className="text-[9px] bg-lime-400/10 text-lime-400 px-2 py-0.5 rounded border border-lime-400/20">Studi Boschmann et al.</span>
                  </div>
                  <p className="text-indigo-100/80 leading-relaxed text-[11px]">
                    Penelitian mempublikasikan bahwa meminum 500ml air putih dapat memicu efek <i>water-induced thermogenesis</i>, meningkatkan metabolic rate hingga 30% selama 40-60 menit setelahnya.
                  </p>
                </div>

                <div className="bg-[#070b19] p-3.5 rounded-xl border border-indigo-900/50 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-amber-400 font-bold">2. Mencegah Penurunan Performa Otot (ACSM)</strong>
                    <span className="text-[9px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded border border-amber-400/20">Studi ACSM Guidelines</span>
                  </div>
                  <p className="text-indigo-100/80 leading-relaxed text-[11px]">
                    Dehidrasi ringan sebesar 2% dari total berat badan terbukti menurunkan kekuatan angkatan angkat beban dan ketahanan fisik hingga 10-15%.
                  </p>
                </div>

                <div className="bg-[#070b19] p-3.5 rounded-xl border border-indigo-900/50 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-cyan-400 font-bold">3. Menjaga Fokus & Fungsi Kognitif Otak</strong>
                    <span className="text-[9px] bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-400/20">Journal of Nutrition</span>
                  </div>
                  <p className="text-indigo-100/80 leading-relaxed text-[11px]">
                    Kekurangan cairan tubuh berdampak langsung pada memori jangka pendek, daya konsentrasi kerja, serta memicu munculnya sakit kepala dan brain fog.
                  </p>
                </div>

                <div className="bg-[#070b19] p-3.5 rounded-xl border border-indigo-900/50 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-purple-400 font-bold">4. Membantu Pencernaan & Ginjal</strong>
                    <span className="text-[9px] bg-purple-400/10 text-purple-400 px-2 py-0.5 rounded border border-purple-400/20">WHO Hydration Report</span>
                  </div>
                  <p className="text-indigo-100/80 leading-relaxed text-[11px]">
                    Air mineral berfungsi melarutkan sisa metabolisme dan mencegah terbentuknya kristal batu ginjal serta menjaga kesehatan pembuluh darah pencernaan.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWaterResearchModal(false)}
                className="w-full py-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold rounded-xl transition text-xs shadow-lg shadow-sky-400/20"
              >
                Saya Mengerti, Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-indigo-900/50 py-4 mt-8 bg-[#050814] text-center text-xs text-indigo-200/50">
        NutriSync Indonesia © {new Date().getFullYear()} — Ekosistem Nutrisi Sehat & Olahraga Berbasis Bahan Lokal
      </footer>
    </div>
  );
}