### /Users/jeromesinaca/My Apps/CCRentals/./components/BookingCalendar.tsx.bak
```
1: ### /Users/jeromesinaca/My Apps/CCRentals/./components/BookingCalendar.tsx
2: ```
3: 1: import React, { useState, useEffect } from 'react';
4: 2: import { motion, AnimatePresence } from 'framer-motion';
5: 3: 
6: 4: interface BookingCalendarProps {
7: 5:   onDateSelect?: (startDate: Date, endDate: Date) => void;
8: 6:   blockedDates?: Date[];
9: 7: }
10: 8: 
11: 9: const BookingCalendar: React.FC<BookingCalendarProps> = ({
12: 10:   onDateSelect,
13: 11:   blockedDates = []
14: 12: }) => {
15: 13:   const [currentMonth, setCurrentMonth] = useState(new Date());
16: 14:   const [startDate, setStartDate] = useState<Date | null>(null);
17: 15:   const [endDate, setEndDate] = useState<Date | null>(null);
18: 16:   const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
19: 17:   const [focusedDate, setFocusedDate] = useState<number | null>(null);
20: 18: 
21: 19:   const monthNames = [
22: 20:     'January', 'February', 'March', 'April', 'May', 'June',
23: 21:     'July', 'August', 'September', 'October', 'November', 'December'
24: 22:   ];
25: 23: 
26: 24:   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
27: 25: 
28: 26:   const handleKeyDown = (date: Date, index: number, e: React.KeyboardEvent) => {
29: 27:     const daysInMonth = getDaysInMonth(currentMonth);
30: 28:     let newIndex = index;
31: 29: 
32: 30:     switch (e.key) {
33: 31:       case 'ArrowLeft':
34: 32:         newIndex = index - 1;
35: 33:         break;
36: 34:       case 'ArrowRight':
37: 35:         newIndex = index + 1;
38: 36:         break;
39: 37:       case 'ArrowUp':
40: 38:         newIndex = index - 7;
41: 39:         break;
42: 40:       case 'ArrowDown':
43: 41:         newIndex = index + 7;
44: 42:         break;
45: 43:       case 'Home':
46: 44:         newIndex = 0;
47: 45:         break;
48: 46:       case 'End':
49: 47:         newIndex = daysInMonth.length - 1;
50: 48:         break;
51: 49:       case 'PageUp':
52: 50:         e.preventDefault();
53: 51:         prevMonth();
54: 52:         return;
55: 53:       case 'PageDown':
56: 54:         e.preventDefault();
57: 55:         nextMonth();
58: 56:         return;
59: 57:       default:
60: 58:         return;
61: 59:     }
62: 60: 
63: 61:     if (newIndex >= 0 && newIndex < daysInMonth.length && daysInMonth[newIndex]) {
64: 62:       setFocusedDate(newIndex);
65: 63:       const buttons = document.querySelectorAll('[role="gridcell"][tabindex="0"]');
66: 64:       const targetButton = buttons[newIndex] as HTMLElement;
67: 65:       targetButton?.focus();
68: 66:     }
69: 67:   };
70: 68: 
71: 69:   const getDaysInMonth = (date: Date) => {
72: 70:     const year = date.getFullYear();
73: 71:     const month = date.getMonth();
74: 72:     const firstDay = new Date(year, month, 1);
75: 73:     const lastDay = new Date(year, month + 1, 0);
76: 74:     const daysInMonth = lastDay.getDate();
77: 75:     const startingDayOfWeek = firstDay.getDay();
78: 76: 
79: 77:     const days: (Date | null)[] = [];
80: 78: 
81: 79:     for (let i = 0; i < startingDayOfWeek; i++) {
82: 80:       days.push(null);
83: 81:     }
84: 82: 
85: 83:     for (let day = 1; day <= daysInMonth; day++) {
86: 84:       days.push(new Date(year, month, day));
87: 85:     }
88: 86: 
89: 87:     return days;
90: 88:   };
91: 89: 
92: 90:   const isSameDay = (date1: Date | null, date2: Date | null) => {
93: 91:     if (!date1 || !date2) return false;
94: 92:     return (
95: 93:       date1.getFullYear() === date2.getFullYear() &&
96: 94:       date1.getMonth() === date2.getMonth() &&
97: 95:       date1.getDate() === date2.getDate()
98: 96:     );
99: 97:   };
100: 98: 
101: 99:   const isDateBlocked = (date: Date) => {
102: 100:     return blockedDates.some(blocked => isSameDay(blocked, date));
103: 101:   };
104: 102: 
105: 103:   const isDateInPast = (date: Date) => {
106: 104:     const today = new Date();
107: 105:     today.setHours(0, 0, 0, 0);
108: 106:     return date < today;
109: 107:   };
110: 108: 
111: 109:   const isDateInRange = (date: Date) => {
112: 110:     if (!startDate || !endDate) {
113: 111:       if (startDate && hoveredDate && !isSameDay(startDate, date)) {
114: 112:         const rangeStart = startDate < hoveredDate ? startDate : hoveredDate;
115: 113:         const rangeEnd = startDate < hoveredDate ? hoveredDate : startDate;
116: 114:         return date > rangeStart && date < rangeEnd;
117: 115:       }
118: 116:       return false;
119: 117:     }
120: 118:     return date > startDate && date < endDate;
121: 119:   };
122: 120: 
123: 121:   const handleDateClick = (date: Date) => {
124: 122:     if (isDateBlocked(date) || isDateInPast(date)) return;
125: 123: 
126: 124:     if (!startDate || (startDate && endDate)) {
127: 125:       setStartDate(date);
128: 126:       setEndDate(null);
129: 127:     } else {
130: 128:       if (date < startDate) {
131: 129:         setEndDate(startDate);
132: 130:         setStartDate(date);
133: 131:       } else {
134: 132:         setEndDate(date);
135: 133:       }
136: 134: 
137: 135:       if (onDateSelect) {
138: 136:         const finalStart = date < startDate ? date : startDate;
139: 137:         const finalEnd = date < startDate ? startDate : date;
140: 138:         onDateSelect(finalStart, finalEnd);
141: 139:       }
142: 140:     }
143: 141:   };
144: 142: 
145: 143:   const nextMonth = () => {
146: 144:     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
147: 145:     setFocusedDate(0);
148: 146:   };
149: 147: 
150: 148:   const prevMonth = () => {
151: 149:     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
152: 150:     setFocusedDate(0);
153: 151:   };
154: 152: 
155: 153:   const resetSelection = () => {
156: 154:     setStartDate(null);
157: 155:     setEndDate(null);
158: 156:   };
159: 157: 
160: 158:   const getDaysBetween = () => {
161: 159:     if (!startDate || !endDate) return 0;
162: 160:     const diff = Math.abs(endDate.getTime() - startDate.getTime());
163: 161:     return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
164: 162:   };
165: 163: 
166: 164:   const days = getDaysInMonth(currentMonth);
167: 165:   const daysBetween = getDaysBetween();
168: 166: 
169: 167:   const weeks: (Date | null)[][] = [];
170: 168:   for (let i = 0; i < days.length; i += 7) {
171: 169:     weeks.push(days.slice(i, i + 7));
172: 170:   }
173: 171: 
174: 172:   return (
175: 173:     <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
176: 174:       <div className="mb-6">
177: 175:         <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
178: 176:           Select Rental Dates
179: 177:         </h3>
180: 178:         <p className="text-muted-foreground text-sm">
181: 179:           Choose your start and end dates
182: 180:         </p>
183: 181:       </div>
184: 182: 
185: 183:       <div className="flex items-center justify-between mb-6" role="group" aria-label="Month navigation">
186: 184:         <button
187: 185:           type="button"
188: 186:           onClick={prevMonth}
189: 187:           className="p-2 hover:bg-secondary rounded-lg transition-colors"
190: 188:           aria-label="Previous month"
191: 189:         >
192: 190:           <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
193: 191:             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
194: 192:           </svg>
195: 193:         </button>
196: 194:         <div className="text-lg font-bold text-foreground" aria-live="polite" aria-atomic="true">
197: 195:           {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
198: 196:         </div>
199: 197:         <button
200: 198:           type="button"
201: 199:           onClick={nextMonth}
202: 200:           className="p-2 hover:bg-secondary rounded-lg transition-colors"
203: 201:           aria-label="Next month"
204: 202:         >
205: 203:           <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
206: 204:             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
207: 205:           </svg>
208: 206:         </button>
209: 207:       </div>
210: 208: 
211: 209:       <div
212: 210:         role="grid"
213: 211:         aria-label="Calendar"
214: 212:         className="space-y-2"
215: 213:       >
216: 214:         <div role="row" className="grid grid-cols-7 gap-2">
217: 215:           {daysOfWeek.map((day) => (
218: 216:             <div key={day} role="columnheader" className="text-center text-xs font-bold text-muted-foreground py-2">
219: 217:               {day}
220: 218:             </div>
221: 219:           ))}
222: 220:         </div>
223: 221: 
224: 222:         {weeks.map((week, weekIndex) => (
225: 223:           <div role="row" key={weekIndex} className="grid grid-cols-7 gap-2">
226: 224:             {week.map((date, dayIndex) => {
227: 225:               const globalIndex = weekIndex * 7 + dayIndex;
228: 226:               if (!date) {
229: 227:                 return <div key={globalIndex} role="gridcell" aria-hidden="true" />;
230: 228:               }
231: 229: 
232: 230:               const isStart = isSameDay(date, startDate);
233: 231:               const isEnd = isSameDay(date, endDate);
234: 232:               const isInRange = isDateInRange(date);
235: 233:               const isBlocked = isDateBlocked(date);
236: 234:               const isPast = isDateInPast(date);
237: 235:               const isDisabled = isBlocked || isPast;
238: 236: 
239: 237:               const isSelected = isStart || isEnd;
240: 238:               const availabilityLabel = isDisabled
241: 239:                 ? (isBlocked ? 'unavailable' : 'past date')
242: 240:                 : 'available';
243: 241:               
244: 242:               return (
245: 243:                 <motion.button
246: 244:                   type="button"
247: 245:                   key={date.toISOString()}
248: 246:                   role="gridcell"
249: 247:                   onClick={() => handleDateClick(date)}
250: 248:                   onMouseEnter={() => setHoveredDate(date)}
251: 249:                   onMouseLeave={() => setHoveredDate(null)}
252: 250:                   onKeyDown={(e) => handleKeyDown(date, globalIndex, e)}
253: 251:                   disabled={isDisabled}
254: 252:                   tabIndex={focusedDate === globalIndex ? 0 : -1}
255: 253:                   whileHover={!isDisabled ? { scale: 1.1 } : {}}
256: 254:                   whileTap={!isDisabled ? { scale: 0.95 } : {}}
257: 255:                   aria-label={monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ', ' + availabilityLabel}
258: 256:                   aria-selected={isSelected}
259: 257:                   aria-disabled={isDisabled}
260: 258:                   className={aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all + 
261: 259:                     (isStart || isEnd
262: 260:                       ? ' bg-primary text-primary-foreground shadow-lg shadow-primary/25 z-10'
263: 261:                       : isInRange
264: 262:                       ? ' bg-primary/20 text-foreground'
265: 263:                       : isDisabled
266: 264:                       ? ' text-muted-foreground/30 cursor-not-allowed'
267: 265:                       : ' hover:bg-secondary text-foreground'
268: 266:                     )}
269: 267:                 >
270: 268:                   {date.getDate()}
271: 269:                 </motion.button>
272: 270:               );
273: 271:             })}
274: 272:           </div>
275: 273:         ))}
276: 274:       </div>
277: 275: 
278: 276:       <AnimatePresence>
279: 277:         {(startDate || endDate) && (
280: 278:           <motion.div
281: 279:             initial={{ opacity: 0, height: 0 }}
282: 280:             animate={{ opacity: 1, height: 'auto' }}
283: 281:             exit={{ opacity: 0, height: 0 }}
284: 282:             className="mt-6 pt-6 border-t border-border"
285: 283:             role="region"
286: 284:             aria-label="Selected date range"
287: 285:           >
288: 286:             <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
289: 287:               <div className="grid grid-cols-2 gap-4 mb-3">
290: 288:                 <div>
291: 289:                   <div className="text-xs text-muted-foreground mb-1">Start Date</div>
292: 290:                   <div className="font-bold text-foreground">
293: 291:                     {startDate?.toLocaleDateString('en-US', {
294: 292:                       month: 'short',
295: 293:                       day: 'numeric',
296: 294:                       year: 'numeric'
297: 295:                     })}
298: 296:                   </div>
299: 297:                 </div>
300: 298:                 {endDate && (
301: 299:                   <div>
302: 300:                     <div className="text-xs text-muted-foreground mb-1">End Date</div>
303: 301:                     <div className="font-bold text-foreground">
304: 302:                       {endDate?.toLocaleDateString('en-US', {
305: 303:                         month: 'short',
306: 304:                         day: 'numeric',
307: 305:                         year: 'numeric'
308: 306:                       })}
309: 307:                     </div>
310: 308:                   </div>
311: 309:                 )}
312: 310:               </div>
313: 311:               {daysBetween > 0 && (
314: 312:                 <div className="text-center pt-3 border-t border-primary/20">
315: 313:                   <span className="text-2xl font-bold text-primary">{daysBetween}</span>
316: 314:                   <span className="text-sm text-muted-foreground ml-2">
317: 315:                     {daysBetween === 1 ? 'day' : 'days'}
318: 316:                   </span>
319: 317:                 </div>
320: 318:               )}
321: 319:             </div>
322: 320: 
323: 321:             <button
324: 322:               type="button"
325: 323:               onClick={resetSelection}
326: 324:               className="w-full mt-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
327: 325:             >
328: 326:               Clear Selection
329: 327:             </button>
330: 328:           </motion.div>
331: 329:         )}
332: 330:       </AnimatePresence>
333: 331: 
334: 332:       <div className="mt-6 pt-6 border-t border-border" role="region" aria-label="Calendar legend">
335: 333:         <div className="flex flex-wrap gap-4 text-xs">
336: 334:           <div className="flex items-center gap-2">
337: 335:             <div className="w-4 h-4 rounded bg-primary" aria-hidden="true" />
338: 336:             <span className="text-muted-foreground">Selected</span>
339: 337:           </div>
340: 338:           <div className="flex items-center gap-2">
341: 339:             <div className="w-4 h-4 rounded bg-primary/20" aria-hidden="true" />
342: 340:             <span className="text-muted-foreground">In Range</span>
343: 341:           </div>
344: 342:           <div className="flex items-center gap-2">
345: 343:             <div className="w-4 h-4 rounded bg-muted-foreground/10" aria-hidden="true" />
346: 344:             <span className="text-muted-foreground">Unavailable</span>
347: 345:           </div>
348: 346:         </div>
349: 347:       </div>
350: 348:     </div>
351: 349:   );
352: 350: };
353: 351: 
354: 352: export default BookingCalendar;
355: ```
```
