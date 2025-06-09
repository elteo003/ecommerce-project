// pages/product/[id].tsx
import { GetServerSideProps, NextPage } from 'next'
import React, { useState } from 'react'
import prisma from '../../utils/prisma'
import Layout from '../../components/Layout'
import { getPayloadFromReq } from '../../utils/auth'

interface Product {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  price: number
}

interface Props {
  product: Product
  isAuthenticated: boolean
}

const ProductPage: NextPage<Props> = ({ product, isAuthenticated }) => {
  const [qty, setQty] = useState(1)

  const addToCart = async () => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: qty }),
    })
    alert('Aggiunto al carrello')
  }

  const buyNow = async () => {
    await addToCart()
    window.location.href = '/cart'
  }

  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Immagine */}
        <div style={{ width: '100%', height: '400px', position: 'relative' }}>
          <img
            src={product.imageUrl ?? '/placeholder.png'}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>

        {/* Titolo */}
        <h1 style={{ fontSize: '3rem', fontWeight: 700, textAlign: 'center', margin: '1.5rem 0' }}>
          {product.name}
        </h1>

        {/* Descrizione */}
        <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          {product.description ?? 'Nessuna descrizione disponibile.'}
        </p>

        {/* Controlli solo se loggato */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Quantità */}
            <div>
              <label>
                Quantità:{' '}
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                  style={{ width: '4rem', padding: '0.25rem' }}
                />
              </label>
            </div>

            {/* Aggiungi al carrello */}
            <button
              onClick={addToCart}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Aggiungi al carrello
            </button>

            {/* Compra ora */}
            <button
              onClick={buyNow}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#e00',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Compra ora
            </button>
          </div>
        ) : (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
            <a href="/login" style={{ color: '#0070f3' }}>
              Accedi
            </a>{' '}
            per vedere il prezzo e le opzioni di acquisto.
          </p>
        )}
      </div>
    </Layout>
  )
}

export default ProductPage

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, req }) => {
  const { id } = params as { id: string }
  const p = await prisma.product.findUnique({ where: { id } })
  if (!p) return { notFound: true }

  const payload = getPayloadFromReq(req as any)

  return {
    props: {
      product: {
        id: p.id,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        price: p.price,
      },
      isAuthenticated: Boolean(payload),
    },
  }
}
