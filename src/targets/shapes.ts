/**
 * Original vector silhouettes for the LED chart, drawn from the supplied
 * reference images. Nothing here traces or reproduces an official illustration;
 * the paths are authored for this project as simplified fan art in a single
 * cold-light language.
 */

interface StrokeRule {
  width?: number;
  dash?: number[];
  alpha?: number;
}

export interface Artwork {
  name: string;
  width: number;
  height: number;
  paths: Array<{ d: string; stroke?: StrokeRule; fill?: boolean; alpha?: number }>;
  cuts?: Array<{ d: string; width?: number; fill?: boolean; dash?: number[]; alpha?: number }>;
  accent?: Array<{ d: string; stroke?: StrokeRule; fill?: boolean; alpha?: number }>;
  drawExtra?: (ctx: CanvasRenderingContext2D) => void;
}

const hatSkull: Artwork = {
  name: "straw-hat-jolly-roger",
  width: 900,
  height: 900,
  paths: [
    // Crossbones behind the skull, with rounded shafts.
    { d: "M168 686 L732 214", stroke: { width: 52 } },
    { d: "M732 686 L168 214", stroke: { width: 52 } },
    // Bone knuckles at all four ends.
    { d: "M100 716 A38 38 0 1 0 176 716 A38 38 0 1 0 100 716 Z", fill: true },
    { d: "M138 678 A34 34 0 1 0 206 678 A34 34 0 1 0 138 678 Z", fill: true },
    { d: "M694 716 A38 38 0 1 0 770 716 A38 38 0 1 0 694 716 Z", fill: true },
    { d: "M694 678 A34 34 0 1 0 762 678 A34 34 0 1 0 694 678 Z", fill: true },
    { d: "M100 244 A38 38 0 1 0 176 244 A38 38 0 1 0 100 244 Z", fill: true },
    { d: "M138 282 A34 34 0 1 0 206 282 A34 34 0 1 0 138 282 Z", fill: true },
    { d: "M694 244 A38 38 0 1 0 770 244 A38 38 0 1 0 694 244 Z", fill: true },
    { d: "M694 282 A34 34 0 1 0 762 282 A34 34 0 1 0 694 282 Z", fill: true },
    // Skull cranium and jaw.
    {
      d: "M286 404 C286 334 356 284 450 284 C544 284 614 334 614 404 L610 482 C610 532 594 568 566 594 C534 624 492 638 450 638 C408 638 366 624 334 594 C306 568 290 532 290 482 Z",
      fill: true,
    },
    // Straw hat crown and wide brim.
    {
      d: "M228 280 C238 158 326 98 450 98 C574 98 662 158 672 280 C562 306 338 306 228 280 Z",
      fill: true,
    },
    {
      d: "M84 288 C200 234 320 218 450 218 C580 218 700 234 816 288 C778 338 640 364 450 364 C260 364 122 338 84 288 Z",
      fill: true,
    },
    // Brim outline and crown edge give the hat a readable silhouette.
    { d: "M84 288 C200 234 320 218 450 218 C580 218 700 234 816 288", stroke: { width: 5, alpha: 0.7 } },
    { d: "M128 300 C246 264 654 264 772 300", stroke: { width: 3, dash: [10, 12], alpha: 0.55 } },
    // Straw stitching on the crown.
    { d: "M282 162 C360 124 540 124 618 162", stroke: { width: 4, dash: [8, 15], alpha: 0.65 } },
    { d: "M258 196 C344 152 556 152 642 196", stroke: { width: 3, dash: [7, 17], alpha: 0.5 } },
    // Jaw seam and cheek architecture.
    { d: "M306 572 C360 608 392 622 450 630 C508 622 540 608 594 572", stroke: { width: 4, dash: [11, 11], alpha: 0.8 } },
    { d: "M322 518 C356 538 394 546 450 546 C506 546 544 538 578 518", stroke: { width: 3, dash: [8, 12], alpha: 0.55 } },
    // Bone centre grooves.
    { d: "M190 650 L700 190 M710 650 L200 190", stroke: { width: 3, dash: [10, 16], alpha: 0.4 } },
  ],
  cuts: [
    // Large hollow eye sockets.
    {
      d: "M316 440 C316 396 352 376 390 382 C426 388 444 420 438 456 C432 492 400 510 366 502 C334 494 316 470 316 440 Z",
      fill: true,
    },
    {
      d: "M584 440 C584 396 548 376 510 382 C474 388 456 420 462 456 C468 492 500 510 534 502 C566 494 584 470 584 440 Z",
      fill: true,
    },
    // Nose cavity.
    {
      d: "M438 522 C442 508 458 508 462 522 C468 540 458 554 450 562 C442 554 432 540 438 522 Z",
      fill: true,
    },
    // Stitched grin.
    { d: "M334 578 C388 628 512 628 566 578", width: 13 },
    { d: "M378 592 L378 618 M414 600 L414 626 M450 602 L450 630 M486 600 L486 626 M522 592 L522 618", width: 8 },
    { d: "M324 568 L344 588 M344 568 L324 588 M576 568 L556 588 M556 568 L576 588", width: 7 },
    // Hat band (the red band reads as a dark stripe in cold light).
    { d: "M232 264 C340 288 560 288 668 264", width: 30 },
    // Hat brim shadow.
    { d: "M126 294 C250 260 650 260 774 294", width: 6 },
    // Jaw and cheek seams.
    { d: "M300 536 C322 562 342 582 372 600 M600 536 C578 562 558 582 528 600", width: 3, dash: [6, 10] },
  ],
  accent: [
    // The straw-hat band is the one warm accent in the jolly roger.
    { d: "M232 264 C340 288 560 288 668 264", stroke: { width: 17, alpha: 0.95 } },
  ],
};

const luffy: Artwork = {
  name: "straw-hat-luffy",
  width: 900,
  height: 1250,
  paths: [
    // Straw hat, seen from behind: crown, wide brim and a raised crown seam.
    {
      d: "M252 340 C262 206 340 142 450 142 C560 142 638 206 648 340 C558 366 342 366 252 340 Z",
      fill: true,
    },
    {
      d: "M78 352 C196 292 304 276 450 276 C596 276 704 292 822 352 C736 418 586 446 450 446 C314 446 164 418 78 352 Z",
      fill: true,
    },
    { d: "M252 340 C350 366 550 366 648 340", stroke: { width: 6, alpha: 0.8 } },
    { d: "M80 352 C200 298 700 298 820 352", stroke: { width: 4, alpha: 0.5 } },
    { d: "M300 220 C352 178 548 178 600 220", stroke: { width: 4, dash: [8, 15], alpha: 0.55 } },
    { d: "M276 264 C344 218 556 218 624 264", stroke: { width: 3, dash: [7, 18], alpha: 0.4 } },
    // Neck and the back of the vest.
    { d: "M404 430 L496 430 L508 500 L392 500 Z", fill: true },
    {
      d: "M298 560 C336 508 386 486 450 486 C514 486 564 508 602 560 L646 716 C654 796 632 858 610 892 L290 892 C268 858 246 796 254 716 Z",
      fill: true,
    },
    // Raised right arm, reaching toward the horizon.
    {
      d: "M594 548 C666 528 724 470 764 404 L834 442 C790 548 720 644 626 704 Z",
      fill: true,
    },
    {
      d: "M758 372 C790 350 836 362 852 394 C868 428 850 466 816 476 C782 486 748 462 746 428 C744 406 746 388 758 372 Z",
      fill: true,
    },
    // Left arm hanging loose at the side.
    {
      d: "M306 566 C274 650 250 748 238 844 L312 856 C328 766 348 684 372 606 Z",
      fill: true,
    },
    {
      d: "M228 842 C260 830 300 842 306 872 C312 902 290 928 258 928 C226 928 206 904 210 878 C212 862 218 850 228 842 Z",
      fill: true,
    },
    // Shorts, legs and sandals.
    { d: "M300 862 L600 862 L622 1000 L492 1040 L450 950 L408 1040 L278 1000 Z", fill: true },
    {
      d: "M326 1000 C316 1070 298 1134 280 1186 L360 1200 C380 1130 396 1070 406 1016 Z",
      fill: true,
    },
    {
      d: "M574 1000 C596 1070 616 1130 636 1180 L556 1200 C536 1130 514 1070 494 1016 Z",
      fill: true,
    },
    {
      d: "M240 1186 C274 1162 332 1164 366 1182 C388 1194 382 1224 360 1232 L254 1232 C232 1224 222 1206 240 1186 Z",
      fill: true,
    },
    {
      d: "M542 1180 C576 1158 636 1160 668 1178 C690 1190 682 1218 660 1226 L554 1226 C532 1218 524 1200 542 1180 Z",
      fill: true,
    },
    // Back seams and cuffs keep the silhouette from reading as a flat blob.
    { d: "M360 512 C350 636 348 760 354 878", stroke: { width: 4, dash: [8, 13], alpha: 0.7 } },
    { d: "M540 512 C550 636 552 760 546 878", stroke: { width: 4, dash: [8, 13], alpha: 0.7 } },
    { d: "M304 868 C380 890 520 890 596 868", stroke: { width: 13 } },
    { d: "M338 1032 C330 1086 316 1140 302 1180", stroke: { width: 3, dash: [7, 12], alpha: 0.5 } },
    { d: "M562 1032 C570 1086 584 1140 598 1180", stroke: { width: 3, dash: [7, 12], alpha: 0.5 } },
    { d: "M248 1204 C304 1212 348 1208 366 1226", stroke: { width: 6 } },
    { d: "M552 1198 C608 1206 652 1202 670 1220", stroke: { width: 6 } },
  ],
  cuts: [
    // Brim shadow and crown separation.
    { d: "M126 362 C240 408 660 408 774 362", width: 8 },
    // The vest opens down the centre of the back.
    { d: "M450 500 L450 876", width: 6 },
    // Shoulder yokes.
    { d: "M382 520 C370 626 366 752 370 872", width: 3, dash: [6, 12] },
    { d: "M518 520 C530 626 534 752 530 872", width: 3, dash: [6, 12] },
    // Shorts split and leg openings.
    { d: "M450 878 L450 992", width: 8 },
    { d: "M300 1002 C340 1016 386 1016 408 1002 M492 1002 C514 1016 560 1016 600 1002", width: 5 },
    // Sandal straps.
    { d: "M266 1180 L340 1202 M590 1174 L660 1196", width: 4 },
  ],
  accent: [
    // The straw hat band is the only warm note on the figure.
    { d: "M258 332 C350 358 550 358 642 332", stroke: { width: 26, alpha: 0.95 } },
  ],
};

const logPose: Artwork = {
  name: "log-pose-compass",
  width: 900,
  height: 900,
  paths: [
    // Outer graduated ring.
    { d: "M450 24 A426 426 0 1 0 451 24 Z", stroke: { width: 10 } },
    { d: "M450 68 A382 382 0 1 0 451 68 Z", stroke: { width: 3, dash: [3, 16] } },
    { d: "M450 96 A354 354 0 1 0 451 96 Z", stroke: { width: 2, alpha: 0.5 } },
    // Glass dome.
    {
      d: "M450 128 C612 128 730 246 730 406 C730 578 602 696 450 696 C298 696 170 578 170 406 C170 246 288 128 450 128 Z",
      stroke: { width: 9 },
    },
    // Glass reflection.
    { d: "M246 302 C300 218 372 178 466 166", stroke: { width: 5, alpha: 0.55 } },
    // Longitude / latitude grid.
    { d: "M450 132 C342 238 314 566 450 692 M450 132 C558 238 586 566 450 692", stroke: { width: 3, dash: [5, 13] } },
    { d: "M174 368 C286 412 614 412 726 368 M172 460 C284 506 616 506 728 460", stroke: { width: 3, dash: [5, 13] } },
    // Instrument ring.
    { d: "M450 218 A230 230 0 1 0 451 218 Z", stroke: { width: 6 } },
    { d: "M450 252 A196 196 0 1 0 451 252 Z", stroke: { width: 2, dash: [2, 12], alpha: 0.55 } },
    // Compass needle.
    { d: "M450 242 L508 514 L450 462 L392 514 Z", fill: true },
    { d: "M450 654 L414 528 L450 548 L486 528 Z", stroke: { width: 14 } },
    { d: "M450 462 L450 550", stroke: { width: 9 } },
    // Cardinal markers.
    { d: "M450 90 L468 132 L450 120 L432 132 Z", fill: true },
    { d: "M450 806 L468 764 L450 776 L432 764 Z", fill: true },
    { d: "M68 430 L110 448 L98 430 L110 412 Z", fill: true },
    { d: "M832 430 L790 448 L802 430 L790 412 Z", fill: true },
    // Base cradle.
    { d: "M286 738 C372 766 528 766 614 738 L652 814 C544 850 356 850 248 814 Z", fill: true },
    { d: "M322 824 C384 841 516 841 578 824", stroke: { width: 4, dash: [5, 13] } },
    // Base feet.
    { d: "M272 818 L248 858 L340 858 L354 822 Z", fill: true },
    { d: "M628 818 L652 858 L560 858 L546 822 Z", fill: true },
  ],
  cuts: [
    // Needle inlay.
    { d: "M450 274 L486 474 L450 444 L414 474 Z", width: 5, dash: [4, 8] },
    // Cardinal ticks.
    { d: "M450 112 L450 142 M450 760 L450 790 M112 430 L142 430 M760 430 L790 430", width: 6 },
    // Base hatch.
    { d: "M312 790 C380 806 520 806 588 790", width: 3, dash: [6, 10] },
  ],
  drawExtra(ctx) {
    // Graduations around the brass rim.
    ctx.save();
    for (let i = 0; i < 48; i += 1) {
      const a = (i / 48) * Math.PI * 2;
      const inner = i % 4 === 0 ? 392 : 402;
      ctx.lineWidth = i % 4 === 0 ? 5 : 2;
      ctx.beginPath();
      ctx.moveTo(450 + Math.cos(a) * inner, 450 + Math.sin(a) * inner);
      ctx.lineTo(450 + Math.cos(a) * 416, 450 + Math.sin(a) * 416);
      ctx.stroke();
    }
    ctx.restore();
  },
};

const ship: Artwork = {
  name: "sunny-ship",
  width: 1200,
  height: 900,
  paths: [
    // Hull, deck and rails.
    {
      d: "M128 612 C206 681 325 724 456 739 L1002 708 C1071 677 1116 623 1142 557 L1055 570 C992 635 882 665 754 671 L319 638 C250 631 187 625 128 612 Z",
      fill: true,
      alpha: 0.66,
    },
    {
      d: "M128 612 C206 681 325 724 456 739 L1002 708 C1071 677 1116 623 1142 557",
      stroke: { width: 18 },
    },
    { d: "M210 681 C356 748 560 773 792 753 L996 733", stroke: { width: 5, dash: [22, 16] } },
    { d: "M460 663 L512 731 M612 670 L662 735 M764 666 L808 726", stroke: { width: 4, dash: [7, 11] } },
    // Bowsprit.
    { d: "M154 596 L35 520", stroke: { width: 13 } },
    // Sun-lion figurehead.
    { d: "M212 620 A104 104 0 1 0 210 828 A104 104 0 1 0 212 620 Z", stroke: { width: 10 } },
    { d: "M236 671 C255 654 280 659 285 681 C289 701 270 715 249 712 C226 708 214 690 236 671 Z", fill: true },
    { d: "M188 661 C204 646 219 651 220 668 C222 686 204 696 188 692 C170 688 170 674 188 661 Z", fill: true },
    { d: "M260 744 C286 735 306 750 298 770 C289 790 261 788 251 771 C245 760 248 750 260 744 Z", fill: true },
    { d: "M212 603 L212 565 M302 654 L338 628 M308 790 L344 813 M211 846 L211 880 M117 785 L82 807 M110 653 L75 627", stroke: { width: 14 } },
    // Masts and yardarm.
    { d: "M562 236 L562 640 M869 190 L869 639", stroke: { width: 16 } },
    { d: "M557 281 L867 226", stroke: { width: 10 } },
    // Rigging.
    { d: "M562 238 L898 584 M562 238 L1044 454 M869 194 L557 590 M869 194 L1086 526", stroke: { width: 3, alpha: 0.55 } },
    { d: "M562 250 L770 222 M869 205 L1006 380", stroke: { width: 2, dash: [6, 8], alpha: 0.45 } },
    // Main sail.
    {
      d: "M583 267 C685 245 776 239 863 264 L841 548 C762 573 690 576 583 559 Z",
      fill: true,
      alpha: 0.24,
    },
    { d: "M583 267 C685 245 776 239 863 264 L841 548 C762 573 690 576 583 559 Z", stroke: { width: 8 } },
    // Secondary sail.
    {
      d: "M466 310 C518 289 555 283 587 288 L578 534 C530 554 492 563 453 565 Z",
      fill: true,
      alpha: 0.22,
    },
    { d: "M466 310 C518 289 555 283 587 288 L578 534 C530 554 492 563 453 565 Z", stroke: { width: 7 } },
    // Jib sail.
    { d: "M837 287 L1018 438 L840 537 Z", stroke: { width: 10 } },
    // Crow's nest, flagpole and flag.
    { d: "M507 226 L617 226 L606 273 L519 273 Z", stroke: { width: 8 } },
    { d: "M562 142 L562 226 M548 154 L576 154", stroke: { width: 7 } },
    { d: "M562 146 L642 160 L562 186 Z", fill: true },
    // Jolly Roger on the flag.
    { d: "M581 158 C586 150 600 150 605 158 C610 166 603 176 594 178 C584 176 578 166 581 158 Z", stroke: { width: 2, alpha: 0.9 } },
    { d: "M586 162 A3 3 0 1 0 592 162 A3 3 0 1 0 586 162 Z", fill: true },
    { d: "M600 162 A3 3 0 1 0 606 162 A3 3 0 1 0 600 162 Z", fill: true },
    // Deck rail.
    { d: "M262 735 L1030 701", stroke: { width: 7 } },
    // Portholes.
    { d: "M367 686 A18 18 0 1 0 369 686 Z", stroke: { width: 5 } },
    { d: "M457 691 A18 18 0 1 0 459 691 Z", stroke: { width: 5 } },
    { d: "M698 685 A18 18 0 1 0 700 685 Z", stroke: { width: 5 } },
    { d: "M789 679 A18 18 0 1 0 791 679 Z", stroke: { width: 5 } },
    { d: "M880 674 A18 18 0 1 0 882 674 Z", stroke: { width: 5 } },
    // Deck cabin.
    { d: "M787 606 L965 594 L986 626 L820 645 Z", fill: true },
    // Rails and ropes.
    { d: "M262 735 L262 700 M330 730 L330 695 M398 726 L398 691", stroke: { width: 3, alpha: 0.6 } },
    // Sea.
    { d: "M58 823 C181 786 265 855 384 821 C489 791 561 850 674 823 C778 799 902 844 1134 808", stroke: { width: 7, dash: [24, 20] } },
    { d: "M92 858 C210 828 306 884 438 850 C552 822 658 874 790 848 C900 826 1018 858 1112 842", stroke: { width: 3, dash: [8, 18], alpha: 0.5 } },
  ],
  cuts: [
    // Cabin window.
    { d: "M844 611 L915 607 L922 624 L852 630 Z", fill: true },
    // Sail seams.
    { d: "M636 260 L627 551 M694 251 L684 561 M759 249 L745 560", width: 4, dash: [10, 16] },
    { d: "M503 300 L494 546 M538 292 L529 552", width: 4, dash: [10, 16] },
    // Sail repair patches.
    { d: "M700 350 L748 344 L752 392 L704 398 Z", width: 3 },
    { d: "M536 360 L572 354 L576 392 L540 398 Z", width: 3 },
    // Sunny eye.
    { d: "M244 678 C256 669 269 676 267 690", width: 7 },
    // Hull planks.
    { d: "M300 690 C470 742 762 731 1004 706 M330 710 C500 752 760 745 970 720", width: 3, dash: [12, 12] },
    // Wave highlights.
    { d: "M150 813 C210 800 250 822 306 816 M712 826 C768 812 810 830 862 822", width: 4, dash: [6, 14] },
  ],
  accent: [
    // The lion figurehead carries the ship's warm accent.
    { d: "M212 620 A104 104 0 1 0 210 828 A104 104 0 1 0 212 620 Z", stroke: { width: 8, alpha: 0.9 } },
    { d: "M212 603 L212 565 M302 654 L338 628 M308 790 L344 813 M211 846 L211 880 M117 785 L82 807 M110 653 L75 627", stroke: { width: 9, alpha: 0.8 } },
  ],
};

const wantedFrame: Artwork = {
  name: "wanted-poster",
  width: 800,
  height: 1100,
  paths: [
    // Outer paper, slightly worn at the corners. The fill is kept below the
    // sampling threshold so the poster reads as ink and rules, not a slab.
    { d: "M60 34 L740 34 L772 70 L772 1030 L740 1066 L60 1066 L28 1030 L28 70 Z", fill: true, alpha: 0.06 },
    { d: "M60 34 L740 34 L772 70 L772 1030 L740 1066 L60 1066 L28 1030 L28 70 Z", stroke: { width: 17 } },
    { d: "M88 70 L712 70 L738 98 L738 1002 L712 1030 L88 1030 L62 1002 L62 98 Z", stroke: { width: 4, dash: [8, 13] } },
    // Rolled top and bottom rules.
    { d: "M42 52 L720 52 M42 1048 L720 1048", stroke: { width: 5 } },
    { d: "M58 68 L706 68 M58 1035 L706 1035", stroke: { width: 2, dash: [4, 8], alpha: 0.6 } },
    // Corner brackets.
    { d: "M60 150 C95 150 105 118 105 84 M740 150 C705 150 695 118 695 84", stroke: { width: 7 } },
    { d: "M60 950 C95 950 105 982 105 1016 M740 950 C705 950 695 982 695 1016", stroke: { width: 7 } },
    { d: "M112 132 L168 132 M632 132 L688 132 M112 968 L168 968 M632 968 L688 968", stroke: { width: 3, alpha: 0.65 } },
    // Portrait rules.
    { d: "M145 326 L655 326 M145 788 L655 788", stroke: { width: 3, dash: [4, 12] } },
    { d: "M120 300 L120 812 M680 300 L680 812", stroke: { width: 3, dash: [8, 11], alpha: 0.6 } },
    // Original portrait bust: a straw-hatted traveller, line-only so the
    // poster still reads as ink rather than a solid white sheet.
    { d: "M300 436 C270 404 282 352 330 332 C366 316 432 316 470 336 C512 358 522 404 494 438", stroke: { width: 10 } },
    { d: "M228 434 C296 404 504 404 572 434 C528 468 272 468 228 434 Z", stroke: { width: 9 } },
    { d: "M310 420 C352 408 448 408 490 420", stroke: { width: 6 } },
    { d: "M318 438 C310 468 308 512 320 546 C334 578 364 594 400 594 C436 594 466 578 480 546 C492 512 490 468 482 438", stroke: { width: 8 } },
    { d: "M318 486 C300 480 296 500 308 510 M482 486 C500 480 504 500 492 510", stroke: { width: 6 } },
    { d: "M360 586 L356 636 M440 586 L444 636", stroke: { width: 8 } },
    { d: "M252 760 C258 700 300 660 356 644 L444 644 C500 660 542 700 548 760", stroke: { width: 12 } },
    { d: "M356 644 L400 700 L444 644", stroke: { width: 6 } },
    { d: "M340 492 C354 484 372 484 386 492 M414 492 C428 484 446 484 460 492", stroke: { width: 6 } },
    { d: "M400 502 L392 530 C398 534 406 534 412 530", stroke: { width: 5 } },
    { d: "M362 548 C382 564 418 564 438 548", stroke: { width: 6 } },
    { d: "M318 440 C306 452 302 470 306 486 M482 440 C494 452 498 470 494 486", stroke: { width: 4, alpha: 0.7 } },
    // Footer rule.
    { d: "M200 922 L600 922", stroke: { width: 3, dash: [8, 12] } },
    // Rivets.
    { d: "M48 162 A6 6 0 1 0 50 162 Z", fill: true },
    { d: "M752 162 A6 6 0 1 0 754 162 Z", fill: true },
    { d: "M48 940 A6 6 0 1 0 50 940 Z", fill: true },
    { d: "M752 940 A6 6 0 1 0 754 940 Z", fill: true },
    // Small straw-hat emblem in the footer.
    { d: "M318 956 C348 942 394 942 426 956 C408 974 350 976 318 956 Z", fill: true },
    { d: "M334 954 C338 930 360 920 382 924 C402 928 412 942 410 954", stroke: { width: 4 } },
    { d: "M332 950 C354 958 394 958 414 950", stroke: { width: 4 } },
    // Nails.
    { d: "M96 252 A4 4 0 1 0 104 252 A4 4 0 1 0 96 252 Z", fill: true },
    { d: "M696 252 A4 4 0 1 0 704 252 A4 4 0 1 0 696 252 Z", fill: true },
  ],
};

const book: Artwork = {
  name: "training-log-book",
  width: 1100,
  height: 900,
  paths: [
    // Covers.
    {
      d: "M58 238 C246 188 416 228 550 306 C684 228 854 188 1042 238 L1042 704 C854 654 684 694 550 768 C416 694 246 654 58 704 Z",
      fill: true,
      alpha: 0.34,
    },
    {
      d: "M58 238 C246 188 416 228 550 306 C684 228 854 188 1042 238 L1042 704 C854 654 684 694 550 768 C416 694 246 654 58 704 Z",
      stroke: { width: 12 },
    },
    // Page blocks.
    {
      d: "M86 268 C264 224 422 264 540 332 L540 724 C422 656 264 616 86 660 Z",
      fill: true,
    },
    {
      d: "M560 332 C678 264 836 224 1014 268 L1014 660 C836 616 678 656 560 724 Z",
      fill: true,
    },
    // Page stacks.
    { d: "M86 660 C264 616 422 656 540 724", stroke: { width: 10 } },
    { d: "M560 724 C678 656 836 616 1014 660", stroke: { width: 10 } },
    { d: "M96 646 C266 606 416 644 532 704 M568 704 C684 644 834 606 1004 646", stroke: { width: 3, dash: [5, 10], alpha: 0.65 } },
    // Spine.
    { d: "M550 306 L550 768", stroke: { width: 18 } },
    { d: "M540 318 L540 756 M560 318 L560 756", stroke: { width: 3, alpha: 0.6 } },
    // Page rules.
    { d: "M154 358 C282 332 414 360 508 408 M154 408 C282 382 414 410 508 458 M154 458 C282 432 414 460 508 508", stroke: { width: 3, dash: [12, 14], alpha: 0.55 } },
    { d: "M592 408 C686 360 818 332 946 358 M592 458 C686 410 818 382 946 408 M592 508 C686 460 818 432 946 458", stroke: { width: 3, dash: [12, 14], alpha: 0.55 } },
    // Bookmark ribbon.
    { d: "M604 330 L660 344 L650 470 L632 444 L610 470 Z", fill: true },
    // Compass rose on the left page.
    {
      d: "M300 520 L320 580 L380 600 L320 620 L300 680 L280 620 L220 600 L280 580 Z",
      stroke: { width: 4 },
    },
    {
      d: "M300 548 L310 588 L350 600 L310 612 L300 652 L290 612 L250 600 L290 588 Z",
      stroke: { width: 2, dash: [3, 7], alpha: 0.6 },
    },
    // Small island sketch on the right page.
    { d: "M708 520 C736 502 768 506 788 524 C814 546 824 580 806 604 C780 636 726 632 704 600 C690 580 694 542 708 520 Z", stroke: { width: 5 } },
    { d: "M748 524 C744 500 736 482 730 462 M750 522 C764 500 776 486 792 478", stroke: { width: 3 } },
    // Quill.
    { d: "M928 438 C874 476 846 526 842 582 C874 556 906 526 944 500 Z", stroke: { width: 4 } },
    { d: "M842 582 L822 610", stroke: { width: 3 } },
    // Corner ornament.
    { d: "M92 262 C120 250 148 248 176 244 M1008 262 C980 250 952 248 924 244", stroke: { width: 4, alpha: 0.6 } },
  ],
  cuts: [
    // Lines on the pages.
    { d: "M154 558 C276 536 402 560 500 602 M154 600 C276 578 402 602 500 644", width: 2, dash: [9, 15] },
    { d: "M600 602 C698 560 824 536 946 558 M600 644 C698 602 824 578 946 600", width: 2, dash: [9, 15] },
    // Page numbers.
    { d: "M484 674 L510 680 M590 680 L616 674", width: 3 },
    // Spine shadow.
    { d: "M536 332 L536 748 M564 332 L564 748", width: 3, alpha: 0.7 },
  ],
  drawExtra(ctx) {
    // A few page-edge notches keep the book from reading as a flat block.
    ctx.save();
    for (let i = 0; i < 5; i += 1) {
      const y = 350 + i * 58;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(94, y);
      ctx.quadraticCurveTo(84, y + 8, 96, y + 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(1006, y);
      ctx.quadraticCurveTo(1016, y + 8, 1004, y + 14);
      ctx.stroke();
    }
    ctx.restore();
  },
};

const chart: Artwork = {
  name: "new-world-chart",
  width: 1150,
  height: 900,
  paths: [
    // Parchment sheet. Line-only fill so the route and island marks stay
    // legible instead of swimming in a solid particle slab.
    {
      d: "M74 100 L1076 100 L1096 124 L1088 784 L1062 812 L86 812 L64 786 L56 128 Z",
      fill: true,
      alpha: 0.05,
    },
    {
      d: "M74 100 L1076 100 L1096 124 L1088 784 L1062 812 L86 812 L64 786 L56 128 Z",
      stroke: { width: 8 },
    },
    // Faint chart grid.
    { d: "M100 270 C340 250 800 250 1060 270 M100 410 C340 390 800 390 1060 410 M100 550 C340 530 800 530 1060 550 M100 690 C340 670 800 670 1060 690", stroke: { width: 3, dash: [3, 24], alpha: 0.5 } },
    { d: "M260 150 C246 350 246 620 260 764 M460 146 C446 350 446 620 460 766 M660 144 C676 350 676 620 660 766 M860 148 C876 350 876 620 860 764", stroke: { width: 3, dash: [3, 24], alpha: 0.45 } },
    // The route: four islands, then the final mark.
    { d: "M120 700 C180 660 240 690 300 682 C370 672 405 640 456 646 C530 654 580 602 646 592 C714 582 760 536 830 512 C900 488 960 430 1030 330", stroke: { width: 12, dash: [22, 16] } },
    // Island contours, each with enough body to read as land.
    {
      d: "M132 708 C144 668 184 646 226 658 C266 670 296 700 284 726 C270 756 214 766 172 750 C144 740 122 726 132 708 Z",
      fill: true,
      alpha: 0.2,
    },
    { d: "M132 708 C144 668 184 646 226 658 C266 670 296 700 284 726 C270 756 214 766 172 750 C144 740 122 726 132 708 Z", stroke: { width: 12 } },
    {
      d: "M374 662 C386 622 426 606 464 618 C502 630 522 664 506 692 C486 726 430 724 398 704 C380 692 366 678 374 662 Z",
      fill: true,
      alpha: 0.2,
    },
    { d: "M374 662 C386 622 426 606 464 618 C502 630 522 664 506 692 C486 726 430 724 398 704 C380 692 366 678 374 662 Z", stroke: { width: 11 } },
    {
      d: "M570 610 C582 566 622 538 664 548 C706 558 732 598 720 636 C706 680 650 692 608 674 C580 662 562 636 570 610 Z",
      fill: true,
      alpha: 0.2,
    },
    { d: "M570 610 C582 566 622 538 664 548 C706 558 732 598 720 636 C706 680 650 692 608 674 C580 662 562 636 570 610 Z", stroke: { width: 12 } },
    {
      d: "M760 520 C772 478 812 454 854 466 C896 478 922 514 910 552 C896 596 840 606 800 586 C772 572 750 544 760 520 Z",
      fill: true,
      alpha: 0.2,
    },
    { d: "M760 520 C772 478 812 454 854 466 C896 478 922 514 910 552 C896 596 840 606 800 586 C772 572 750 544 760 520 Z", stroke: { width: 12 } },
    // Landmarks: one palm per island.
    { d: "M198 706 C202 682 210 662 220 646 M220 646 C204 636 194 622 192 610 M220 646 C236 632 250 628 262 632 M220 646 C222 626 216 612 208 602", stroke: { width: 6 } },
    { d: "M438 672 C442 648 450 630 460 614 M460 614 C444 604 434 590 432 578 M460 614 C476 600 490 596 502 600 M460 614 C462 594 456 580 448 570", stroke: { width: 5 } },
    { d: "M646 628 C650 600 660 578 672 560 M672 560 C656 550 646 536 644 524 M672 560 C688 546 702 542 714 546 M672 560 C674 540 668 526 660 516", stroke: { width: 5 } },
    { d: "M828 540 C832 512 842 490 854 474 M854 474 C838 464 828 450 826 438 M854 474 C870 460 884 456 896 460 M854 474 C856 454 850 440 842 430", stroke: { width: 5 } },
    // Compass rose.
    { d: "M960 620 L982 668 L1030 690 L982 712 L960 760 L938 712 L890 690 L938 668 Z", stroke: { width: 8 } },
    { d: "M960 652 L972 680 L1000 690 L972 700 L960 728 L948 700 L920 690 L948 680 Z", stroke: { width: 4, dash: [4, 8], alpha: 0.7 } },
    // The final mark.
    { d: "M972 284 L1056 368 M1056 284 L972 368", stroke: { width: 30 } },
    { d: "M1004 264 L1024 264 M1004 388 L1024 388 M952 316 L952 336 M1076 316 L1076 336", stroke: { width: 4 } },
    // Open-water marks.
    { d: "M128 770 C162 754 194 772 226 762 M300 780 C334 764 366 782 398 772", stroke: { width: 4, dash: [6, 10], alpha: 0.45 } },
  ],
};

const laughTaleX: Artwork = {
  name: "laugh-tale-x",
  width: 900,
  height: 900,
  paths: [
    { d: "M156 144 L744 752", stroke: { width: 56 } },
    { d: "M744 144 L156 752", stroke: { width: 56 } },
    // Chart circle.
    { d: "M450 74 A376 376 0 1 0 451 74 Z", stroke: { width: 3, dash: [2, 18] } },
    { d: "M450 112 A338 338 0 1 0 451 112 Z", stroke: { width: 2, dash: [2, 10], alpha: 0.5 } },
    // Sextant stars.
    { d: "M648 164 A64 64 0 1 0 650 164 Z", stroke: { width: 4 } },
    { d: "M642 160 L650 168 M650 160 L642 168", stroke: { width: 3 } },
    // Route marks.
    { d: "M100 416 L144 416 M758 596 L806 596 M237 204 L199 166 M704 714 L734 748", stroke: { width: 6 } },
    { d: "M118 432 C160 450 208 452 246 432", stroke: { width: 2, dash: [4, 10], alpha: 0.7 } },
    // Poneglyph frame ticks.
    { d: "M450 136 L450 184 M450 716 L450 764 M136 450 L184 450 M716 450 L764 450", stroke: { width: 4 } },
  ],
  cuts: [
    // The X carries a worn, broken centre.
    { d: "M412 418 L488 494 M490 414 L414 490", width: 12 },
    { d: "M428 380 L456 404 M444 366 L470 390", width: 4, dash: [6, 8] },
    { d: "M430 520 L456 546", width: 4, dash: [6, 8] },
  ],
};

const island: Artwork = {
  name: "island",
  width: 400,
  height: 400,
  paths: [
    { d: "M50 275 C88 243 126 237 168 246 C210 255 230 238 272 250 C316 262 344 284 354 306 C300 329 130 337 58 310 Z", stroke: { width: 8 } },
    { d: "M176 244 C170 195 154 154 146 116 M174 242 C196 194 214 160 242 126 M175 241 C164 196 194 174 213 150", stroke: { width: 6 } },
    { d: "M144 114 C122 94 112 72 110 45 C142 50 165 70 173 96 M243 124 C265 100 286 93 314 94 C304 123 283 141 257 147", stroke: { width: 5 } },
    { d: "M110 322 C155 334 234 332 285 317", stroke: { width: 3, dash: [5, 12] } },
    { d: "M206 326 C228 334 254 334 272 326", stroke: { width: 2, dash: [3, 8], alpha: 0.6 } },
  ],
};

const compassRose: Artwork = {
  name: "compass-rose",
  width: 400,
  height: 400,
  paths: [
    { d: "M200 40 L226 169 L357 199 L228 230 L200 360 L171 230 L43 199 L171 169 Z", stroke: { width: 4 } },
    { d: "M200 105 L213 184 L292 200 L213 216 L200 295 L187 216 L108 200 L187 184 Z", stroke: { width: 2, dash: [4, 10] } },
    { d: "M200 28 L208 44 L200 38 L192 44 Z", fill: true },
    { d: "M200 372 L208 356 L200 362 L192 356 Z", fill: true },
  ],
};

export const artworks = {
  hatSkull,
  luffy,
  logPose,
  ship,
  wantedFrame,
  book,
  chart,
  laughTaleX,
  island,
  compassRose,
} as const;

export type ArtworkName = keyof typeof artworks;
