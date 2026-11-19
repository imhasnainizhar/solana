'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormData = {
  name: User['name']
}

/**
 * Account details. Sign-in is passwordless, so there is no password to change,
 * and the email is the account's identity (changeable by an admin only).
 */
export const AccountForm: React.FC = () => {
  const { setUser, user } = useAuth()

  const {
    formState: { errors, isLoading, isSubmitting, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>()

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!user) return
      const response = await fetch(`/api/users/${user.id}`, {
        body: JSON.stringify({ name: data.name }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      })

      if (response.ok) {
        const json = await response.json()
        setUser(json.doc)
        toast.success('Successfully updated account.')
        reset({ name: json.doc.name })
      } else {
        toast.error('There was a problem updating your account.')
      }
    },
    [user, setUser, reset],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent('You must be logged in to view this page.')}&redirect=${encodeURIComponent('/account')}`,
      )
    }
    if (user) reset({ name: user.name })
  }, [user, router, reset])

  return (
    <form className="max-w-xl" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-8 mb-8">
        <FormItem>
          <Label htmlFor="email" className="mb-2">
            Email Address
          </Label>
          <Input id="email" readOnly type="email" value={user?.email ?? ''} />
          <p className="mt-2 text-[13px] text-ink-muted">
            You sign in with this address (Google or an email link) — no password needed.
          </p>
        </FormItem>

        <FormItem>
          <Label htmlFor="name" className="mb-2">
            Name
          </Label>
          <Input id="name" {...register('name', { required: 'Please provide a name.' })} type="text" />
          {errors.name && <FormError message={errors.name.message} />}
        </FormItem>
      </div>
      <Button disabled={isLoading || isSubmitting || !isDirty} type="submit" variant="default">
        {isLoading || isSubmitting ? 'Processing' : 'Update Account'}
      </Button>
    </form>
  )
}
