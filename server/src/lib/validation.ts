import prisma from '@lib/prisma';

import { verifyPassword } from './passwordHashing';

// Domain
// ============================================================================

type ValidatableType = string | number | null | undefined;

type ValidationFunction = (
  key: string,
  value: ValidatableType,
  values: { [x: string]: ValidatableType }
) => Promise<ValidatableType>;

interface ValidationRules {
  [x: string]: ValidationFunction[];
}

interface ValidationRuleErrors {
  [x: string]: string[];
}

export class ValidationError {
  message: string;
  errors: ValidationRuleErrors;

  constructor(
    errors: ValidationRuleErrors,
    message = 'Uno o più campi contengono errori'
  ) {
    this.errors = errors;
    this.message = message;
  }
}

// Utils functions
// ============================================================================

const isEmpty = (value: ValidatableType) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' ? value.trim() === '' : false)
  );
};

// Validators
// ============================================================================

export const isRequired: ValidationFunction = async (key, value, _values) => {
  if (isEmpty(value)) {
    throw { [key]: ['Il campo è richiesto'] };
  }

  return value;
};

export const isRequiredIf = (fieldsValues: {
  [x: string]: ValidatableType;
}): ValidationFunction => {
  const isRequiredIfFun: ValidationFunction = async (key, value, values) => {
    // @ts-ignore
    // TODO: understand where's the problem
    for (const [otherKey, otherValue] of fieldsValues) {
      if (!isEmpty(values[otherKey]) && otherValue === values[otherKey]) {
        if (isEmpty(value)) {
          throw { [key]: ['Il campo è richiesto'] };
        }
      }
    }

    return value;
  };

  return isRequiredIfFun;
};

export const isRequiredWith = (field: string): ValidationFunction => {
  const isRequiredWithFun: ValidationFunction = async (key, value, values) => {
    if (values[field] !== undefined && isEmpty(value)) {
      throw { [key]: ['Il campo è richiesto'] };
    }

    return value;
  };

  return isRequiredWithFun;
};

export const isRequiredWithoutAll = (fields: string[]): ValidationFunction => {
  const isRequiredIfFun: ValidationFunction = async (key, value, values) => {
    let otherFieldPresent = false;

    for (const otherKey of fields) {
      if (values[otherKey] !== undefined) {
        otherFieldPresent = true;
        break;
      }
    }

    if (isEmpty(value) && !otherFieldPresent) {
      throw { [key]: ['Il campo è richiesto'] };
    }

    if (!isEmpty(value) && otherFieldPresent) {
      throw { [key]: ['Il campo non è richiesto'] };
    }

    return value;
  };

  return isRequiredIfFun;
};

export const isString: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value)) {
    if (typeof value !== 'string') {
      throw { [key]: ['Il campo deve essere una stringa'] };
    }
  }

  return value;
};

export const isBoolean: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value)) {
    if (typeof value !== 'boolean') {
      throw { [key]: ['Il campo deve essere un valore booleano'] };
    }
  }

  return value;
};

export const isNumber: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value)) {
    if (typeof value !== 'number') {
      throw { [key]: ['Il campo deve essere un numero'] };
    }
  }

  return value;
};

export const isInt: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value)) {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      throw { [key]: ['Il campo deve essere un numero intero'] };
    }
  }

  return value;
};

export const isIntConvert: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value)) {
    if (typeof value === 'number') {
      if (!Number.isInteger(value)) {
        throw { [key]: ['Il campo deve essere un numero intero'] };
      }
    } else {
      if (!/^[0-9]+$/.test(value as string)) {
        throw { [key]: ['Il campo deve essere un numero intero'] };
      }

      const parsed = parseInt(value as string);

      if (isNaN(parsed)) {
        throw { [key]: ['Il campo deve essere un numero intero'] };
      }

      value = parsed;
    }
  }

  return value;
};

export const isMin = (min: number): ValidationFunction => {
  const minFun: ValidationFunction = async (key, value, _values) => {
    if (!isEmpty(value)) {
      if (typeof value === 'string') {
        if (value.length < min) {
          throw {
            [key]: [`Il campo deve contenere almeno ${min} caratteri`],
          };
        }
      } else if (typeof value === 'number') {
        if (value < min) {
          throw {
            [key]: [`Il campo deve essere maggiore o uguale a ${min}`],
          };
        }
      }
    }

    return value;
  };

  return minFun;
};

export const isMax = (max: number): ValidationFunction => {
  const maxFun: ValidationFunction = async (key, value, _values) => {
    if (!isEmpty(value)) {
      if (typeof value === 'string') {
        if (value.length > max) {
          throw {
            [key]: [`Il campo può contenere al massimo ${max} caratteri`],
          };
        }
      } else if (typeof value === 'number') {
        if (value > max) {
          throw {
            [key]: [`Il campo deve essere minore o uguale a ${max}`],
          };
        }
      }
    }

    return value;
  };

  return maxFun;
};

export const isLength = (length: number): ValidationFunction => {
  const maxFun: ValidationFunction = async (key, value, _values) => {
    if (!isEmpty(value) && typeof value === 'string') {
      if (value.length !== length) {
        throw {
          [key]: [`Il campo deve contenere ${length} caratteri`],
        };
      }
    }

    return value;
  };

  return maxFun;
};

export const isIn = (list: ValidatableType[]): ValidationFunction => {
  const maxFun: ValidationFunction = async (key, value, _values) => {
    if (!isEmpty(value)) {
      if (!list.includes(value)) {
        throw {
          [key]: [`Il campo non è valido`],
        };
      }
    }

    return value;
  };

  return maxFun;
};

export const isDate: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if (isNaN(Date.parse(value))) {
      throw { [key]: ['Il campo deve essere una data valida'] };
    }
  }

  return value;
};

export const isEmail: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      throw { [key]: ['Il campo deve essere una email valida'] };
    }
  }

  return value;
};

export const isPhone: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if (!/^\+?[0-9 ]+$/.test(value)) {
      throw { [key]: ['Il campo deve essere un numero telefonico valido'] };
    }
  }

  return value;
};

export const isZip: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if (!/^[0-9]{5}$/.test(value)) {
      throw { [key]: ['Il campo deve essere un CAP valido'] };
    }
  }

  return value;
};

export const isUrl: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value) && typeof value === 'string') {
    try {
      new URL(value);
    } catch (e) {
      throw { [key]: ['Il campo deve essere un URL valido'] };
    }
  }

  return value;
};

export const isFiscalCode: ValidationFunction = async (key, value, _values) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if (!/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i.test(value)) {
      throw { [key]: ['Il campo deve essere un numero telefonico valido'] };
    }
  }

  return value;
};

// export const isUserEmailAvailable = (
//   userIdToExclude?: number
// ): ValidationFunction => {
//   const isUserEmailAvailableFun: ValidationFunction = async (
//     key,
//     value,
//     _values
//   ) => {
//     if (!isEmpty(value) && typeof value === 'string') {
//       if (
//         (await prisma.user.count({
//           where: { email: value, id: { not: userIdToExclude } },
//         })) !== 0
//       ) {
//         throw { [key]: ['Email già utilizzata'] };
//       }
//     }

//     return value;
//   };

//   return isUserEmailAvailableFun;
// };

// export const isClientEmailAvailable = (
//   userIdToExclude?: number
// ): ValidationFunction => {
//   const isClientEmailAvailableFun: ValidationFunction = async (
//     key,
//     value,
//     _values
//   ) => {
//     if (!isEmpty(value) && typeof value === 'string') {
//       if (
//         (await prisma.client.count({
//           where: { email: value, id: { not: userIdToExclude } },
//         })) !== 0
//       ) {
//         throw { [key]: ['Email già utilizzata'] };
//       }
//     }
//     return value;
//   };

//   return isClientEmailAvailableFun;
// };

// export const isAgencyEmailAvailable = (
//   userIdToExclude?: number
// ): ValidationFunction => {
//   const isAgencyEmailAvailableFun: ValidationFunction = async (
//     key,
//     value,
//     _values
//   ) => {
//     if (!isEmpty(value) && typeof value === 'string') {
//       if (
//         (await prisma.agency.count({
//           where: { email: value, id: { not: userIdToExclude } },
//         })) !== 0
//       ) {
//         throw { [key]: ['Email già utilizzata'] };
//       }
//     }
//     return value;
//   };

//   return isAgencyEmailAvailableFun;
// };

// export const isClientIdValid: ValidationFunction = async (
//   key,
//   value,
//   _values
// ) => {
//   if (!isEmpty(value) && typeof value === 'number') {
//     if ((await prisma.client.count({ where: { id: value } })) === 0) {
//       throw { [key]: ['Il cliente selezionato non esiste'] };
//     }
//   }

//   return value;
// };
// export const isServiceIdValid: ValidationFunction = async (
//   key,
//   value,
//   _values
// ) => {
//   if (!isEmpty(value) && typeof value === 'number') {
//     if ((await prisma.service.count({ where: { id: value } })) === 0) {
//       throw { [key]: ['Il servizio selezionato non esiste'] };
//     }
//   }

//   return value;
// };

// export const isAgencyIdValid: ValidationFunction = async (
//   key,
//   value,
//   _values
// ) => {
//   if (!isEmpty(value) && typeof value === 'number') {
//     if ((await prisma.agency.count({ where: { id: value } })) === 0) {
//       throw { [key]: ["L'agenzia selezionata non esiste"] };
//     }
//   }

//   return value;
// };

// export const IscategoryIdValid: ValidationFunction = async (
//   key,
//   value,
//   _values
// ) => {
//   if (!isEmpty(value) && typeof value === 'number') {
//     if ((await prisma.category.count({ where: { id: value } })) === 0) {
//       throw { [key]: ['La categoria selezionata non esiste'] };
//     }
//   }
//   return value;
// };
/*
export const isSellerEmailAvailable: ValidationFunction = async (
  key,
  value,
  _values
) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if ((await prisma.seller.count({ where: { email: value } })) !== 0) {
      throw { [key]: ['Email già utilizzata'] };
    }
  }

  return value;
};

export const isOrderIdAvailable: ValidationFunction = async (
  key,
  value,
  _values
) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if ((await prisma.orders.count({ where: { id: value } })) !== 0) {
      throw { [key]: ['Ordne già esistente'] };
    }
  }

  return value;
};

export const isProductIdAvailable: ValidationFunction = async (
  key,
  value,
  _values
) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if ((await prisma.orderProducts.count({ where: { id: value } })) !== 0) {
      throw { [key]: ['Prodotto già esistente'] };
    }
  }

  return value;
};

export const isInvoiceIdAvailable: ValidationFunction = async (
  key,
  value,
  _values
) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if ((await prisma.invoices.count({ where: { id: value } })) !== 0) {
      throw { [key]: ['Fattura già esistente'] };
    }
  }

  return value;
};

export const isDdtIdAvailable: ValidationFunction = async (
  key,
  value,
  _values
) => {
  if (!isEmpty(value) && typeof value === 'string') {
    if ((await prisma.dDT.count({ where: { id: value } })) !== 0) {
      throw { [key]: ['Ddt già esistente'] };
    }
  }

  return value;
};

export const isUserIdValid: ValidationFunction = async (
  key,
  value,
  _values
) => {
  if (!isEmpty(value) && typeof value === 'number') {
    if ((await prisma.user.count({ where: { id: value } })) === 0) {
      throw { [key]: ["L'utente selezionato non esiste"] };
    }
  }

  return value;
};



export const isAddressIdValid: ValidationFunction = async (
  key,
  value,
  _values
) => {
  if (!isEmpty(value) && typeof value === 'number') {
    if ((await prisma.address.count({ where: { id: value } })) === 0) {
      throw { [key]: ["L'indirizzo selezionato non esiste"] };
    }
  }

  return value;
};*/

export const isPasswordValid = (userId?: number): ValidationFunction => {
  const isUserEmailAvailableFun: ValidationFunction = async (
    key,
    value,
    _values
  ) => {
    if (!isEmpty(value) && typeof value === 'string') {
      const hash = (await prisma.user.findFirst({
        select: { password: true },
        where: { id: userId },
      }))!.password;

      if (!(await verifyPassword(value, hash))) {
        throw { [key]: ['La password inserita non è corretta'] };
      }
    }

    return value;
  };

  return isUserEmailAvailableFun;
};

// Validation function
// ============================================================================

const validate = async (
  data: { [x: string]: ValidatableType },
  rules: ValidationRules
) => {
  let errors: ValidationRuleErrors = {};

  for (const [key, ruleFunctions] of Object.entries(rules)) {
    for (const f of ruleFunctions) {
      try {
        data[key] = await f(key, data[key], data);
      } catch (e: any) {
        errors = { ...errors, ...e };
        continue;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }
};

export default validate;
