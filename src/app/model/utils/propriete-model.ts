import {isNotNullOrUndefined, isObject} from "../utils/utils";

export abstract class ProprieteModel {
    isModified: boolean;

    getPropertyLibelle(propertyKey: string, propriete?: string): string {
        try {
            const metaData = Reflect.getMetadata("label", this, propertyKey);
            if (isNotNullOrUndefined(metaData)) {
                const libelle = metaData.libelle;

                if (isNotNullOrUndefined(propriete)) {
                    propriete = "label";
                }

                if (isObject(libelle)) {
                    if (propriete === "label") {
                        return libelle.label;
                    } else if (propriete === "label2") {
                        return libelle.label2;
                    } else if (propriete === "label3") {
                        return libelle.label3;
                    } else if (propriete === "label4") {
                        return libelle.label4;
                    } else if (propriete === "info") {
                        return libelle.info;
                    } else if (propriete === "question" && libelle.question == true) {
                        return "?";
                    } else if (propriete === "unite") {
                        return libelle.unite;
                    } else if (propriete === "uniteInfo") {
                        if (isNotNullOrUndefined(libelle.unite)) {
                            return "en " + libelle.unite;
                        } else {
                            return "";
                        }
                    }
                } else if (propriete === "label" || propriete === "label2" || propriete === "label3") {
                    return libelle;
                }
            }
            return null;
        } catch (e) {
            console.error("Impossible de lire la propriété " + propriete + " pour : " + this.constructor.name + ".", propertyKey, e);
            return null;
        }
    }

    getPropertyInstance(propertyKey: string): string {
        try {
            const instance = Reflect.getMetadata("dataType", this, propertyKey)?.libelle;
            if (instance) {
                return instance;
            } else {
                return null;
            }
        } catch (e) {
            // console.error("Impossible de lire la propriété pour : " + this.constructor.name + ".", propertyKey, e);
            return null;
        }
    }
}
