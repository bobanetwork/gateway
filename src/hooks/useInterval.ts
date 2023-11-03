/*
Copyright 2021-present Boba Network.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { useEffect, useRef } from 'react'
import { EnvType } from 'util/constant'

const userInterval = (callback: () => void, delay?: EnvType) => {
  const savedCallback = useRef<() => void | null>(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }

    if (delay) {
      tick()
      const id = setInterval(tick, delay as number)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default userInterval
