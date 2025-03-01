import {Prisma} from "@prisma/client";
import {PositionValue} from "./guess";

interface Result extends Prisma.JsonObject {
  correct: boolean;
  positions: PositionValue[];
}

export default Result;