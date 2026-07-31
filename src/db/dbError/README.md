# dbError

Usage:

```ts
import { handleDbError } from './utils/dbError';

try{
  ...
}catch(err){
  const result=handleDbError(err);
  return res.status(result.httpStatus).json(result.response);
}
```

Add your DB constraints to constraints.ts to customize user messages.
