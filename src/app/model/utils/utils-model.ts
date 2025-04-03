import "reflect-metadata";

export function Label(label: any) {
    try {
        return Reflect.metadata("label", {
            libelle: label,
        });
    } catch (e) {
        console.error(e);
    }
}
