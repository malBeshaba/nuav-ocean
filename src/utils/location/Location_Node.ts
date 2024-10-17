import * as math from "mathjs";
// @ts-ignore
import proj4 from "proj4"

const crs_WebMercator = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1+units=m +nadgrids=@null +wktext +no_defs";
const crs_ecef = "+proj=geocent +datum=WGS84 +units=m +no_defs";

function WebMercator2ecef(x_y_h: number[]): number[] {
    const [x, y, z] = proj4(crs_WebMercator, crs_ecef, x_y_h);
    return [x, y, z];
}

function Ecef2WebMercator(x_y_z: number[]): number[] {
    const [x, y, h] = proj4(crs_ecef, crs_WebMercator, x_y_z);
    return [x, y, h];
}
const cell_size = 0.009330691929342804;
const EarthRadius = 6378137.0;
const max_equa = 10;

export class PlanePhotos {
    camera_intrinsic = [
        2053.01,
        1473.02,
        4.17764,
        6.17,
        6.17,
        // [0.16892, -0.436494, -0.000783197, 0.00182996, 0.249652],
    ];
    im: number[][];
    index: number;
    equations: {
        coef: number[][];
        ct: number[][];
    }[];
    tabu: any[];
    loc: [number, number];

    constructor() {
        this.im = this.intrinsic_matrix();
        this.index = 0;
        this.equations = [];
        this.tabu = [];
        this.loc = [0, 0];
    }

    norm_point(point: number[]): number[] {
        const n_p = [
            (point[0] - this.camera_intrinsic[0]) / -this.camera_intrinsic[2],
            (point[1] - this.camera_intrinsic[1]) / -this.camera_intrinsic[2],
        ];
        return n_p;
    }

    add_equation(photo_point: number[], payload_angle: number[], plane_location: number[]) {
        const n_p = this.norm_point(photo_point);
        const rm = rotation_matrix(payload_angle);
        const vm = WebMercator2ecef(plane_location);
        const coef: number[][] = Array.from({ length: 2 }, () => Array(3).fill(0));
        const ct: number[][] = Array.from({ length: 2 }, () => Array(1).fill(0));

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                ct[i][0] += (n_p[i] * rm[j][2] - rm[j][i]) * vm[j];
            }
        }

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                coef[i][j] = n_p[i] * rm[j][2] - rm[j][i];
            }
        }

        this.equations.push({ coef, ct });

        if (this.equations.length > max_equa) {
            this.equations.shift();
        }
    }

    intrinsic_matrix(): number[][] {
        const im = Array.from({ length: 3 }, () => Array(3).fill(0));
        im[0][0] = this.camera_intrinsic[2] / this.camera_intrinsic[3];
        im[1][1] = this.camera_intrinsic[2] / this.camera_intrinsic[4];
        im[2][2] = 1;
        im[0][2] = this.camera_intrinsic[0];
        im[1][2] = this.camera_intrinsic[1];
        return im;
    }

    location() {
        const coef: number[][] =[];
        const ct: number[][] = [];

        for (const eq of this.equations) {
            coef.push(...eq.coef);
            ct.push(...eq.ct);
        }
        var xyz = math.multiply(math.inv(math.multiply(math.transpose(coef), coef)), math.multiply(math.transpose(coef), ct))
        var temp: number[] = []
        xyz.forEach((item: number[]) => {
            item.forEach((i: number) => {
                temp.push(i)
            })
        })
        // xyz = math.transpose(xyz);
        var bla = Ecef2WebMercator(temp);
        return bla;
    }

    click2loc(node: [number, number]) {
        const payload_angle = [[0, -172.10000000000002, -90]];
        const plane_location = [[113.0224508252561, 23.147947230890374, 92.0150978088379]];

        if (!this.tabu.includes(node)) {
            this.add_equation(node, payload_angle[0], plane_location[0]);
            this.tabu.push(node);
            if (this.equations.length >= 2) {
                const bla = this.location();
                // @ts-ignore
                this.loc = [bla[0], bla[1]];
            }
        }
    }
}

function rotation_matrix(new_payload_angle: number[]): number[][] {
    const rm = Array.from({ length: 3 }, () => Array(3).fill(0));
    rm[0][0] = math.cos(new_payload_angle[0]) * math.cos(new_payload_angle[0]);
    rm[1][0] = math.cos(new_payload_angle[0]) * math.sin(new_payload_angle[0]);
    rm[2][0] = -math.sin(new_payload_angle[0]);
    rm[0][1] = math.sin(new_payload_angle[0]) * math.sin(new_payload_angle[0]) * math.cos(new_payload_angle[0]) - math.cos(new_payload_angle[0]) * math.sin(new_payload_angle[0]);
    rm[1][1] = math.sin(new_payload_angle[0]) * math.sin(new_payload_angle[0]) * math.sin(new_payload_angle[0]) + math.cos(new_payload_angle[0]) * math.cos(new_payload_angle[0]);
    rm[2][1] = math.cos(new_payload_angle[0]) * math.sin(new_payload_angle[0]);
    rm[0][2] = math.cos(new_payload_angle[0]) * math.sin(new_payload_angle[0]) * math.cos(new_payload_angle[0]) + math.sin(new_payload_angle[0]) * math.sin(new_payload_angle[0]);
    rm[1][2] = math.cos(new_payload_angle[0]) * math.sin(new_payload_angle[0]) * math.sin(new_payload_angle[0]) - math.sin(new_payload_angle[0]) * math.cos(new_payload_angle[0]);
    rm[2][2] = math.cos(new_payload_angle[0]) * math.cos(new_payload_angle[0]);
    return rm;
}



