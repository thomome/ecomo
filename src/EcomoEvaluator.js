class EcomoEvaluator {
		constructor() {}

		static requiredColumns = ['BVar', 'GSBreite', 'SohlVer', 'LBukVer', 'RBukVer']

    evaluateRow(row) {
        row = { ...row };

        row.LUferBer = 0
        row.RUferBer = 0
        row.Klasse = 0

        if (row.Eindol > 0) {
            row.Klasse = 5
        } else if (row.BVar && row.GSBreite && row.SohlVer && row.LBukVer && row.RBukVer) {
            row.LUferBer = this.calcUbw(row.BVar, row.GSBreite, row.LUfbeBre)
            row.RUferBer = this.calcUbw(row.BVar, row.GSBreite, row.RUfbeBre)

            const wsbv = this.calcWsbv(row.BVar)
            const vds = this.calcVds(row.SohlVer, row.SohlMat)

            const vdbf = {}
            vdbf.links = this.calcVdbf(row.LBukMat, row.LBukVer)
            vdbf.rechts = this.calcVdbf(row.RBukMat, row.RBukVer)
            vdbf.mittel = Math.ceil( (vdbf.links + vdbf.rechts) * 0.5 )

            const ub = {}
            ub.links = this.calcUbr(row.LUferBer, row.LUfbeBew)
            ub.rechts = this.calcUbr(row.RUferBer, row.RUfbeBew)
            ub.mittel = Math.ceil( (ub.links + ub.rechts) * 0.5 )

            row.Klasse = this.calcKlasse(wsbv, vds, vdbf, ub)
        }

        return row
    }

    calcKlasse(wsbv, vds, vdbf, ub) {
        const sum = wsbv + vds + vdbf.mittel + ub.mittel
        if(sum <= 1){
            return 1
        } else if(sum <= 5){
            return 2
        } else if(sum <= 9){
            return 3
        } else {
            return 4
        }
    }

    calcUbr(LUferBer, LUfbeBew){
		switch(LUferBer){
			case 1: // genügend Uferbereich
				switch(LUfbeBew){
					case 1: // gewässergerecht
						return 0
					case 2: // gewässerfremd
                        return 1.5
                    default: // künstlich
						return 3
				}
			case 2: // ungenügend Uferbereich
				switch(LUfbeBew){
					case 1: // gewässergerecht
						return 2
					case 2: // gewässerfremd
						return 3
					default: // künstlich
						return 3
				}
			case 3: // kein Uferbereich
				return 3
		}
	}

    calcVdbf(LBukMat, LBukVer){ 
		if(LBukMat > 4){
			switch(LBukVer){
                case 1: // keine Verbauung
                case 2: // < 10% verbaut
                    return 0
                case 3: // 10%-30% verbaut
                    return 1
                case 4: // 30%-60% verbaut
                    return 2
                default: // > 60% verbaut
                    return 3
            }
        } else { // Material durchlässig
            switch(LBukVer){
                case 1: // keine Verbauung
                case 2: // < 10% verbaut
                    return 0
                case 3: // 10%-30% verbaut
                    return 0.5
                case 4: // 30%-60% verbaut
                    return 1.5
                default: // > 60% verbaut
                    return 2.5
            }
        }
	}

	calcVds(SohlVer, SohlMat){
		switch(SohlVer){
			case 1: // keine Verbauung
				return 0
			case 2: // < 10% verbaut
				return 1
			case 3: // 10%-30% verbaut
				return 2
            default:  // > 30% verbaut
                return SohlMat === 1 ? 2 : 3
		}
	}

    calcWsbv(BVar) {
        return BVar == 1 ? 0 : BVar
    }

    calcUbw(BVar, GSBreite, LUfbeBre) {
        let x, y = 0

        if(LUfbeBre === 0) {
            return 3
        }

        switch (BVar) {
            case 1: // ausgeprägte Variabilität
				x = 10/13
				y = 45/13
				break;
			case 2: // eingeschränkte Variabilität
				x = 15/13
				y = 45/13
				break;
			case 3: // keine Variabilität
				x = 20/13
				y = 45/13
				break;
        }

        const temp = this.clamp(x * GSBreite + y, 5, 15)
        return LUfbeBre >= temp ? 1 : 2
    }

    clamp (n, min, max) {
        return Math.min(Math.max(n, min), max);
    }
}