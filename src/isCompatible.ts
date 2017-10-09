import {IType} from './IType';

function findInType(types: IType[], {type, of}: IType): boolean {
    return types.some(value => {
        if (value.type !== type || (!!value.of && !of) || (!value.of && !!of)) return false;
        if (of && value.of)
            return of.some(ofValue => findInType(value.of, ofValue));

        return true;
    });
}

export function isCompatible(types: IType[], targets: IType[]) {
    return targets.some(target => findInType(types, target));
}
