'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  CheckCircle,
  AlertCircle,
  User
} from "lucide-react"

interface FeedbackFormProps {
  cleaningRecordId: string
  tankName: string
  cleanerName: string
  cleaningDate: string
  onSuccess?: () => void
}

export function FeedbackForm({ 
  cleaningRecordId, 
  tankName, 
  cleanerName, 
  cleaningDate,
  onSuccess 
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cleaningRecordId,
          rating,
          comment,
          isPublic
        })
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to submit feedback')
        return
      }

      setSuccess("Thank you for your feedback!")
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStars = () => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="transition-colors"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Poor"
      case 2: return "Fair"
      case 3: return "Good"
      case 4: return "Very Good"
      case 5: return "Excellent"
      default: return ""
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center">
          <Star className="w-5 h-5 mr-2 text-yellow-400" />
          Rate Your Cleaning Service
        </CardTitle>
        <CardDescription>
          Share your experience to help us improve our service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Service Details:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Tank:</strong> {tankName}</p>
            <p><strong>Cleaner:</strong> {cleanerName}</p>
            <p><strong>Date:</strong> {new Date(cleaningDate).toLocaleDateString()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>How would you rate this cleaning service? *</Label>
            <div className="flex flex-col items-center space-y-2">
              {renderStars()}
              {rating > 0 && (
                <Badge variant="outline" className="text-sm">
                  {getRatingText(rating)}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Additional Comments (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isPublic" className="text-sm">
              Make this feedback public (visible to other users)
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface FeedbackListProps {
  cleanerId?: string
  cleaningRecordId?: string
  showPublicOnly?: boolean
}

export function FeedbackList({ 
  cleanerId, 
  cleaningRecordId, 
  showPublicOnly = true 
}: FeedbackListProps) {
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    loadFeedbacks()
  })

  const loadFeedbacks = async () => {
    try {
      const params = new URLSearchParams()
      if (cleanerId) params.append('cleanerId', cleanerId)
      if (cleaningRecordId) params.append('cleaningRecordId', cleaningRecordId)

      const response = await fetch(`/api/feedback?${params}`)
      const result = await response.json()
      
      if (response.ok) {
        let filteredFeedbacks = result.feedbacks
        if (showPublicOnly) {
          filteredFeedbacks = filteredFeedbacks.filter((f: any) => f.isPublic)
        }
        setFeedbacks(filteredFeedbacks)
      }
    } catch (error) {
      console.error("Failed to load feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{feedback.user.name}</h4>
                    <p className="text-sm text-gray-600">
                      {feedback.cleaningRecord.tank.name} • 
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(feedback.rating)}
                  <p className="text-sm text-gray-600 mt-1">
                    {feedback.rating}/5
                  </p>
                </div>
              </div>
              
              {feedback.comment && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{feedback.comment}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Helpful</span>
                </div>
                {feedback.isPublic && (
                  <Badge variant="secondary" className="text-xs">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Public
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No feedback available</p>
              <p className="text-sm text-gray-500 mt-1">
                Be the first to share your experience
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}