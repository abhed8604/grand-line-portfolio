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
};

const luffy: Artwork = {
  name: "straw-hat-luffy",
  width: 900,
  height: 1250,
  paths: [
    // Hat crown and huge brim behind the head.
    {
      d: "M270 330 C280 190 350 120 450 120 C550 120 620 190 630 330 C520 350 380 350 270 330 Z",
      fill: true,
    },
    {
      d: "M56 332 C188 276 310 258 450 258 C590 258 712 276 844 332 C772 402 620 432 450 432 C280 432 128 402 56 332 Z",
      fill: true,
    },
    // Face, ears and neck.
    {
      d: "M326 402 C326 340 380 306 450 306 C520 306 574 340 574 402 L570 502 C568 564 520 608 450 616 C380 608 332 564 330 502 Z",
      fill: true,
    },
    { d: "M294 470 A30 34 0 1 0 354 470 A30 34 0 1 0 294 470 Z", fill: true },
    { d: "M546 470 A30 34 0 1 0 606 470 A30 34 0 1 0 546 470 Z", fill: true },
    { d: "M412 606 L488 606 L502 664 L398 664 Z", fill: true },
    // Open vest torso.
    {
      d: "M302 670 C334 640 380 626 410 622 L490 622 C520 626 566 640 598 670 C618 740 614 812 598 866 L302 866 C286 812 282 740 302 670 Z",
      fill: true,
    },
    // Raised right arm, reaching for the hat brim.
    { d: "M576 682 C636 672 686 618 722 548", stroke: { width: 50 } },
    { d: "M718 524 A36 36 0 1 0 790 524 A36 36 0 1 0 718 524 Z", fill: true },
    // Left arm thrown out toward the horizon.
    { d: "M324 682 C266 700 224 744 198 798", stroke: { width: 50 } },
    { d: "M144 792 A35 35 0 1 0 214 792 A35 35 0 1 0 144 792 Z", fill: true },
    // Shorts, legs and sandals.
    {
      d: "M318 844 L582 844 L618 958 L492 1004 L450 916 L408 1004 L282 958 Z",
      fill: true,
    },
    { d: "M338 966 C328 1040 310 1102 288 1160", stroke: { width: 62 } },
    { d: "M522 970 C550 1040 574 1098 596 1150", stroke: { width: 62 } },
    {
      d: "M228 1166 C258 1140 322 1138 356 1156 C378 1168 372 1198 350 1206 L244 1206 C222 1198 212 1180 228 1166 Z",
      fill: true,
    },
    {
      d: "M550 1158 C580 1132 644 1134 674 1152 C694 1164 686 1192 664 1200 L560 1200 C540 1192 534 1174 550 1158 Z",
      fill: true,
    },
    // Hat band and brim seam.
    { d: "M276 314 C350 334 550 334 624 314", stroke: { width: 28 } },
    { d: "M96 346 C218 300 682 300 804 346", stroke: { width: 4, dash: [10, 14], alpha: 0.6 } },
    // Straw stitching.
    { d: "M314 194 C366 158 534 158 586 194", stroke: { width: 4, dash: [8, 15], alpha: 0.55 } },
    { d: "M288 238 C348 200 552 200 612 238", stroke: { width: 3, dash: [7, 18], alpha: 0.4 } },
    // Vest edges and seams.
    { d: "M358 664 C346 724 340 796 338 850", stroke: { width: 4, dash: [8, 13], alpha: 0.7 } },
    { d: "M542 664 C554 724 560 796 562 850", stroke: { width: 4, dash: [8, 13], alpha: 0.7 } },
    // Belt / shorts waist.
    { d: "M322 842 C398 862 502 862 578 842", stroke: { width: 15 } },
    // Sandal soles and straps.
    { d: "M240 1180 C300 1188 346 1182 360 1200", stroke: { width: 6 } },
    { d: "M562 1172 C620 1180 664 1176 678 1194", stroke: { width: 6 } },
    { d: "M268 1150 L342 1172 M590 1142 L658 1164", stroke: { width: 4 } },
  ],
  cuts: [
    // Spiky hair, cut dark from the filled face.
    {
      d: "M316 432 C300 348 364 288 450 288 C536 288 600 348 584 432 L570 404 L560 450 L542 390 L528 448 L510 376 L494 450 L478 366 L460 450 L444 366 L428 450 L410 376 L394 448 L380 390 L366 450 L350 404 Z",
      fill: true,
    },
    // Temple hair.
    { d: "M316 432 C304 472 310 522 330 556 L350 552 L340 500 L356 466 Z", fill: true },
    { d: "M584 432 C596 472 590 522 570 556 L550 552 L560 500 L544 466 Z", fill: true },
    // Closed, laughing eyes.
    { d: "M344 488 C376 444 422 444 446 488", width: 23 },
    { d: "M454 488 C478 444 524 444 556 488", width: 23 },
    // Scar under the left eye: a bold vertical cut with two cross stitches.
    { d: "M518 498 L518 548", width: 13 },
    { d: "M500 512 L536 512", width: 12 },
    { d: "M502 536 L534 536", width: 12 },
    // Nose tick.
    { d: "M442 506 C448 518 456 518 462 508", width: 7 },
    // Wide open grin.
    {
      d: "M338 542 C380 624 520 624 562 542 C516 566 384 566 338 542 Z",
      fill: true,
    },
    { d: "M326 530 L348 552 M348 530 L326 552 M574 530 L552 552 M552 530 L574 552", width: 7 },
    // Open shirt V and centre seam. The V reaches the waistband so the vest
    // reads as two hanging panels instead of a closed shirt.
    { d: "M388 626 L450 850 L512 626", width: 26 },
    { d: "M450 850 L450 858", width: 7 },
    { d: "M380 656 C370 722 364 790 362 848", width: 6 },
    { d: "M520 656 C530 722 536 790 538 848", width: 6 },
    // Shorts split and cuff lines.
    { d: "M450 872 L450 966", width: 8 },
    { d: "M300 954 C344 968 390 968 410 954 M490 954 C510 968 556 968 600 954", width: 5 },
    // Collar bones.
    { d: "M402 676 C424 690 438 692 450 690 M498 676 C476 690 462 692 450 690", width: 3, alpha: 0.9 },
    // Straw hat band is drawn as a cut for contrast.
    { d: "M276 314 C350 334 550 334 624 314", width: 28 },
    // Hair strand gaps.
    { d: "M390 340 L414 396 M450 330 L450 400 M510 340 L486 396", width: 3 },
  ],
  drawExtra(ctx) {
    // Teeth sit inside the dark grin. They are deliberately chunky so they
    // survive the particle sampler at small figure sizes.
    ctx.save();
    ctx.fillStyle = "#fff";
    for (const x of [382, 422, 462, 502]) {
      ctx.fillRect(x, 560, 20, 20);
      ctx.fillRect(x + 5, 580, 10, 7);
    }
    ctx.restore();
  },
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
      alpha: 0.12,
    },
    { d: "M583 267 C685 245 776 239 863 264 L841 548 C762 573 690 576 583 559 Z", stroke: { width: 8 } },
    // Secondary sail.
    {
      d: "M466 310 C518 289 555 283 587 288 L578 534 C530 554 492 563 453 565 Z",
      fill: true,
      alpha: 0.1,
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
    // Parchment sheet with a worn deckle. Kept line-only so the route and
    // island marks remain legible instead of swimming in a white sheet.
    {
      d: "M82 128 L1068 128 L1094 158 L1078 756 L1046 788 L100 788 L72 756 L66 160 Z",
      fill: true,
      alpha: 0.06,
    },
    {
      d: "M82 128 L1068 128 L1094 158 L1078 756 L1046 788 L100 788 L72 756 L66 160 Z",
      stroke: { width: 14 },
    },
    { d: "M98 154 L1050 154 L1068 176 L1054 746 L1030 764 L112 764 L88 742 L84 180 Z", stroke: { width: 5, dash: [12, 14] } },
    // Chart grid.
    { d: "M120 276 C330 252 820 252 1030 276 M112 396 C330 372 820 372 1038 396 M108 516 C330 492 820 492 1042 516 M106 636 C330 612 820 612 1046 636", stroke: { width: 4, dash: [4, 20], alpha: 0.7 } },
    { d: "M250 170 C230 330 230 620 250 748 M450 166 C430 330 430 620 450 752 M650 164 C670 330 670 620 650 752 M850 168 C870 330 870 620 850 746", stroke: { width: 4, dash: [4, 20], alpha: 0.65 } },
    // The route, by way of four islands.
    { d: "M132 654 C228 584 270 676 356 610 C442 544 488 636 574 560 C660 484 708 548 792 486 C866 432 940 412 1020 328", stroke: { width: 11, dash: [20, 15] } },
    { d: "M132 654 C228 584 270 676 356 610 C442 544 488 636 574 560 C660 484 708 548 792 486 C866 432 940 412 1020 328", stroke: { width: 3, alpha: 0.6 } },
    // Island contours.
    { d: "M154 676 C184 644 240 646 258 674 C274 700 250 728 214 728 C178 728 134 706 154 676 Z", stroke: { width: 9 } },
    { d: "M334 620 C356 590 402 592 420 620 C438 650 412 678 380 678 C348 676 316 648 334 620 Z", stroke: { width: 8 } },
    { d: "M558 560 C580 534 622 536 638 562 C654 588 632 614 602 614 C572 612 540 586 558 560 Z", stroke: { width: 8 } },
    { d: "M790 496 C808 470 848 472 862 498 C876 524 856 548 828 548 C800 546 774 520 790 496 Z", stroke: { width: 8 } },
    // Island hatching and trees.
    { d: "M184 682 C198 666 220 666 232 682 M356 628 C368 614 386 614 396 628 M578 568 C590 554 608 554 618 568 M810 504 C822 490 838 490 848 504", stroke: { width: 5 } },
    // Waypoint crosses.
    { d: "M212 652 L242 682 M242 652 L212 682", stroke: { width: 7 } },
    { d: "M378 598 L408 628 M408 598 L378 628", stroke: { width: 6 } },
    { d: "M600 540 L628 568 M628 540 L600 568", stroke: { width: 6 } },
    // Ship silhouette on the route.
    {
      d: "M888 412 C938 430 982 446 1030 448 L1014 484 C972 492 924 484 886 466 L864 474 L872 438 Z",
      fill: true,
    },
    { d: "M930 446 L930 396 M972 448 L972 404", stroke: { width: 6 } },
    { d: "M930 400 L976 414 L930 426 Z", stroke: { width: 5 } },
    // Compass rose lower right.
    {
      d: "M964 588 L986 648 L1048 670 L986 692 L964 752 L942 692 L880 670 L942 648 Z",
      stroke: { width: 7 },
    },
    {
      d: "M964 616 L976 656 L1016 670 L976 684 L964 722 L952 684 L912 670 L952 656 Z",
      stroke: { width: 4, dash: [4, 8], alpha: 0.7 },
    },
    // Final X.
    { d: "M962 290 L1028 356 M1028 290 L962 356", stroke: { width: 22 } },
    { d: "M948 276 L1042 276 M948 370 L1042 370", stroke: { width: 4, dash: [6, 10], alpha: 0.7 } },
    // Rolled chart edges.
    { d: "M82 128 C62 116 52 136 66 160 M1068 128 C1088 116 1098 136 1094 158", stroke: { width: 10 } },
    { d: "M72 756 C54 772 64 796 84 796 M1046 788 C1064 800 1072 780 1078 756", stroke: { width: 10 } },
    // Tiny route notes (drawn as marks, no invented credentials).
    { d: "M148 334 L210 334 M148 350 L190 350 M148 366 L202 366", stroke: { width: 4, dash: [5, 9], alpha: 0.7 } },
    { d: "M898 214 L960 214 M898 230 L944 230", stroke: { width: 4, dash: [5, 9], alpha: 0.7 } },
  ],
  cuts: [
    // Chart corner fold.
    { d: "M1030 760 L1068 730 L1074 764 Z", alpha: 0.8 },
    // A few wave marks through the open water.
    { d: "M300 740 C330 726 358 742 384 734 M676 706 C704 692 734 708 760 700", width: 4, dash: [7, 8] },
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
