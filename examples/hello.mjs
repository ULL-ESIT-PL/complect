/* Ejemplo elemental de uso de llvm-bindings para crear una función que suma dos enteros */
import llvm from 'llvm-bindings';

function main() {
  const context = new llvm.LLVMContext(); // Gestiona los datos globales y el estado de la compilación
  const module = new llvm.Module('demo', context); // Representa un programa completo, contiene funciones, variables globales, etc.
  const builder = new llvm.IRBuilder(context); // Ayuda a construir instrucciones LLVM de manera más sencilla

  const returnType = builder.getInt32Ty();
  const paramTypes = [builder.getInt32Ty(), builder.getInt32Ty()];
  const functionType = llvm.FunctionType.get(returnType, paramTypes, false);
  const func = llvm.Function.Create(
    functionType, // Tipo de la función
    llvm.Function.LinkageTypes.ExternalLinkage, // Visibilidad: puede ser llamada desde otros módulos
    'add', // Nombre de la función
    module, // Módulo al que pertenece la función
  );

  const entryBB = llvm.BasicBlock.Create(context, 'entry', func); // Bloque básico de entrada para la función
  builder.SetInsertPoint(entryBB); // Define entryBB como el bloque básico por defecto donde se insertarán todas las instrucciones que siguen
  const a = func.getArg(0); // Nodo del AST IR del primer parámetro
  const b = func.getArg(1); // Nodo del AST IR del segundo parámetro
  const result = builder.CreateAdd(a, b); // Crea un AST IR de suma
  builder.CreateRet(result); // Crea un AST IR de retorno con el resultado de la suma

  if (llvm.verifyFunction(func)) {
    // See https://llvm.org/doxygen/Verifier_8h.html
    console.error('Verifying function failed');
    return;
  }
  if (llvm.verifyModule(module)) {
    console.error('Verifying module failed');
    return;
  }
  console.log(
    module.print(), //Genera el código LLVM IR del módulo
  );
}

main();
