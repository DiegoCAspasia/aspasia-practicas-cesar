export class Utils{
    // Añadir funciones para reutilizar en otros archivos aqui.
    // Para usar las funciones en otro archivo replicar esta estructura:
    /**
     * include { Utils } from './utilidades.js' // Esto hace accesible esta clase Utils desde otro archivo 
     * 
     * Utils.decirHola(); // Esto llama a la funcion "decirHola" de esta clase Utils
     */

    /** Funcion de ejemplo:
     * 
     * static decirHola(){
     *      console.log("Hola");
     * }
     * 
     */

    // Las funciones se deben declarar como "static nombreDeFuncion(argumentos)" para evitar tener que instanciar un objeto de Utils
    /**
     * let utils = new Utils();     // NO, MAL
     * utils.decirHola();
     */
    /**
     * Utils.decirHola();       // SI, BIEN
     */

}