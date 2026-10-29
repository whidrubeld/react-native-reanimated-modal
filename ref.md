# Ref API

> open() and close() through a ref — for a modal mounted visible that closes itself with its animation — and why close() still needs an onHide that sets visible to false.

The modal takes a `ref` with two methods, `open()` and `close()`. They run the same animations as a change of `visible`, and do nothing while the modal is already open (or closed) or still animating.

They are for a modal that owns its lifetime — mounted with `visible` from the start, for instance by a navigator or a modal manager, and closing itself with its animation before it is unmounted:

```tsx
import { useRef } from 'react';
import { Button } from 'react-native';
import { Modal, type ModalRef } from 'react-native-reanimated-modal';

function ConfirmModal({ onDismiss }: { onDismiss: () => void }) {
  const modal = useRef<ModalRef>(null);

  return (
    <Modal ref={modal} visible onHide={onDismiss}>
      <Button title="Done" onPress={() => modal.current?.close()} />
    </Modal>
  );
}
```

| Method    | Does                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `open()`  | Shows the modal with its animation; nothing if it is open or animating                 |
| `close()` | Hides it with its animation, then calls `onHide`; nothing if it is closed or animating |

> **Caution**
>
> `visible` stays the source of truth. After `close()`, `onHide` must set `visible` to `false` — or unmount the modal, as `onDismiss` above does. If `visible` is still `true` once the animation ends, the modal opens again.
>
> The same holds the other way: `open()` on a modal whose `visible` is `false` shows it, and the modal closes again as soon as it is open.

For a modal you show and hide from its parent, `visible` is all you need — the methods add nothing there.