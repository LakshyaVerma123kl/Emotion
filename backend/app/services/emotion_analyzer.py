import random
import time
import uuid
from typing import Dict, List, Tuple
from datetime import datetime
from collections import Counter
from transformers import pipeline
from app.models.emotion import (
    EmotionType, 
    EmotionAnalysisRequest, 
    EmotionAnalysisResponse,
    EmotionStats
)
from app.core.logging import get_logger

logger = get_logger(__name__)

class EmotionAnalyzer:
    """Advanced emotion analysis service with improved accuracy"""
    
    def __init__(self):
        self.analysis_count = 0
        # emotion_history now stores tuples of (emotion_value, confidence)
        self.emotion_history: List[Tuple[str, float]] = [] 
        self.total_processing_time = 0.0
        
        # Enhanced emotion keywords with weights
        self.emotion_keywords = {
            EmotionType.HAPPY: {
                'primary': ['happy', 'joy', 'joyful', 'elated', 'ecstatic', 'blissful'],
                'secondary': ['great', 'amazing', 'wonderful', 'fantastic', 'awesome', 'brilliant', 'cheerful', 'delighted', 'pleased'],
                'contextual': ['celebration', 'success', 'achievement', 'victory', 'win']
            },
            EmotionType.SAD: {
                'primary': ['sad', 'depressed', 'melancholy', 'grief', 'sorrow', 'despair'],
                'secondary': ['down', 'blue', 'gloomy', 'miserable', 'heartbroken', 'disappointed'],
                'contextual': ['crying', 'tears', 'loss', 'farewell', 'goodbye', 'miss']
            },
            EmotionType.ANXIOUS: {
                'primary': ['anxious', 'anxiety', 'worried', 'nervous', 'panic', 'fearful'],
                'secondary': ['scared', 'afraid', 'uneasy', 'restless', 'tense', 'on edge'],
                'contextual': ['stress', 'pressure', 'overwhelming', 'uncertain', 'doubt']
            },
            EmotionType.ANGRY: {
                'primary': ['angry', 'mad', 'furious', 'rage', 'irate', 'livid'],
                'secondary': ['irritated', 'annoyed', 'frustrated', 'outraged', 'hostile', 'bitter'],
                'contextual': ['hate', 'disgusted', 'fed up', 'can\'t stand', 'infuriating']
            },
            EmotionType.EXCITED: {
                'primary': ['excited', 'thrilled', 'exhilarated', 'energetic', 'pumped'],
                'secondary': ['eager', 'enthusiastic', 'animated', 'vibrant', 'spirited'],
                'contextual': ['can\'t wait', 'looking forward', 'anticipating', 'psyched']
            },
            EmotionType.CONFUSED: {
                'primary': ['confused', 'puzzled', 'perplexed', 'bewildered', 'baffled'],
                'secondary': ['lost', 'unclear', 'uncertain', 'mixed up', 'stumped'],
                'contextual': ['don\'t understand', 'makes no sense', 'what\'s going on']
            },
            EmotionType.CALM: {
                'primary': ['calm', 'peaceful', 'serene', 'tranquil', 'composed'],
                'secondary': ['relaxed', 'quiet', 'still', 'balanced', 'centered'],
                'contextual': ['meditation', 'mindful', 'zen', 'at peace', 'harmony']
            },
            EmotionType.FRUSTRATED: {
                'primary': ['frustrated', 'exasperated', 'aggravated', 'vexed'],
                'secondary': ['stuck', 'blocked', 'hindered', 'bothered', 'irked'],
                'contextual': ['nothing works', 'keep trying', 'obstacles', 'barriers']
            },
            EmotionType.HOPEFUL: {
                'primary': ['hopeful', 'optimistic', 'positive', 'confident', 'upbeat'],
                'secondary': ['encouraged', 'inspired', 'motivated', 'determined'],
                'contextual': ['better tomorrow', 'things will improve', 'light at the end', 'faith']
            },
            EmotionType.DISAPPOINTED: {
                'primary': ['disappointed', 'let down', 'discouraged', 'deflated'],
                'secondary': ['dissatisfied', 'disheartened', 'dismayed', 'disillusioned'],
                'contextual': ['expected more', 'didn\'t work out', 'fell short', 'not what I hoped']
            },
            EmotionType.OVERWHELMED: {
                'primary': ['overwhelmed', 'swamped', 'buried', 'overloaded'],
                'secondary': ['too much', 'can\'t handle', 'drowning', 'suffocating'],
                'contextual': ['so many things', 'no time', 'pressure', 'breaking point']
            },
            EmotionType.CONFIDENT: {
                'primary': ['confident', 'sure', 'certain', 'assured', 'self-assured'],
                'secondary': ['capable', 'strong', 'empowered', 'bold', 'fearless'],
                'contextual': ['I can do this', 'believe in myself', 'ready', 'prepared']
            },
            EmotionType.GRATEFUL: {
                'primary': ['grateful', 'thankful', 'appreciative', 'blessed'],
                'secondary': ['fortunate', 'lucky', 'appreciate', 'value'],
                'contextual': ['thank you', 'so grateful', 'appreciate', 'blessed']
            },
            EmotionType.LONELY: {
                'primary': ['lonely', 'alone', 'isolated', 'solitary'],
                'secondary': ['disconnected', 'abandoned', 'forsaken', 'left out'],
                'contextual': ['no one understands', 'by myself', 'missing people', 'social isolation']
            },
            EmotionType.STRESSED: {
                'primary': ['stressed', 'pressure', 'tension', 'strain'],
                'secondary': ['overwhelmed', 'burned out', 'exhausted', 'drained'],
                'contextual': ['deadlines', 'workload', 'responsibilities', 'juggling']
            },
            EmotionType.PROUD: {
                'primary': ['proud', 'accomplished', 'satisfied', 'fulfilled'],
                'secondary': ['achieved', 'successful', 'impressed', 'pleased'],
                'contextual': ['hard work paid off', 'exceeded expectations', 'milestone', 'breakthrough']
            }
        }
        
        # Contextual suggestions for each emotion
        self.emotion_suggestions = {
            EmotionType.HAPPY: [
                "Share your joy with someone special today",
                "Take a moment to savor this positive feeling",
                "Consider keeping a gratitude journal to remember these moments",
                "Use this positive energy to tackle a challenge you've been avoiding",
                "Practice mindfulness to fully appreciate this happiness"
            ],
            EmotionType.SAD: [
                "Allow yourself to feel these emotions - they're valid and temporary",
                "Reach out to a trusted friend or family member for support",
                "Consider gentle activities like walking in nature or listening to music",
                "Practice self-compassion and avoid harsh self-judgment",
                "If feelings persist, consider speaking with a counselor"
            ],
            EmotionType.ANXIOUS: [
                "Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8",
                "Break down your worries into smaller, manageable action steps",
                "Practice grounding techniques: name 5 things you can see, 4 you can touch, 3 you can hear",
                "Consider mindfulness meditation or progressive muscle relaxation",
                "Talk to someone you trust about your concerns"
            ],
            EmotionType.ANGRY: [
                "Take 10 deep breaths before responding to what triggered you",
                "Try physical exercise to release built-up tension safely",
                "Ask yourself: 'What am I really feeling underneath this anger?'",
                "Practice 'I' statements when expressing your feelings to others",
                "Consider whether this situation will matter in 5 years"
            ],
            EmotionType.EXCITED: [
                "Channel this positive energy into a meaningful project",
                "Share your excitement with others who will celebrate with you",
                "Plan concrete steps to make the most of this momentum",
                "Use this motivation to tackle tasks you've been putting off",
                "Document this feeling to remember during tougher times"
            ],
            EmotionType.CONFUSED: [
                "Take time to gather more information before making decisions",
                "Break complex situations into smaller, clearer components",
                "Seek perspective from someone with relevant experience",
                "Remember that confusion often precedes clarity and growth",
                "Consider writing down your thoughts to organize them"
            ],
            EmotionType.CALM: [
                "Enjoy this peaceful moment and notice what created it",
                "Use this mental clarity to reflect on important decisions",
                "Practice gratitude for this sense of balance and well-being",
                "Consider what habits or practices help you maintain this state",
                "Share your calm energy with others who might need it"
            ],
            EmotionType.FRUSTRATED: [
                "Take a break and return to the situation with fresh perspective",
                "Try a completely different approach to the problem",
                "Ask for help or advice from someone who might have insights",
                "Remember that obstacles are often opportunities in disguise",
                "Focus on what you can control rather than what you can't"
            ],
            EmotionType.HOPEFUL: [
                "Build on this optimism by creating concrete action plans",
                "Share your positive outlook with others who might benefit",
                "Use this momentum to take the next step toward your goals",
                "Document your hopes and dreams to revisit when motivation wanes",
                "Celebrate small wins along the way to maintain this feeling"
            ],
            EmotionType.DISAPPOINTED: [
                "Acknowledge your feelings without judgment - disappointment is natural",
                "Look for lessons or silver linings in this experience",
                "Focus on what you can control moving forward",
                "Remember that setbacks often set us up for bigger comebacks",
                "Consider adjusting expectations while maintaining your core values"
            ],
            EmotionType.OVERWHELMED: [
                "Make a list of everything on your mind, then prioritize ruthlessly",
                "Focus on completing one task at a time rather than multitasking",
                "Delegate or eliminate non-essential activities",
                "Take regular breaks to prevent burnout",
                "Consider asking for help - you don't have to handle everything alone"
            ],
            EmotionType.CONFIDENT: [
                "Use this confidence to tackle a challenge you've been avoiding",
                "Share your knowledge or skills with others who could benefit",
                "Set a new goal that stretches your capabilities",
                "Remember this feeling during times of self-doubt",
                "Consider mentoring someone who could use your confidence"
            ],
            EmotionType.GRATEFUL: [
                "Write a thank-you note to someone who has impacted your life",
                "Start a daily gratitude practice to cultivate this feeling",
                "Look for ways to pay your blessings forward to others",
                "Share your appreciation with the people who matter to you",
                "Use this gratitude as motivation to help others"
            ],
            EmotionType.LONELY: [
                "Reach out to an old friend or family member you haven't contacted recently",
                "Consider joining a group or class based on your interests",
                "Practice self-compassion - being alone doesn't mean being lonely",
                "Engage in activities that connect you with your community",
                "Remember that feeling lonely is temporary and you have value"
            ],
            EmotionType.STRESSED: [
                "Identify the specific sources of your stress and address them one by one",
                "Practice stress-relief techniques like deep breathing or meditation",
                "Ensure you're getting enough sleep, exercise, and proper nutrition",
                "Consider time management strategies to better organize your responsibilities",
                "Don't hesitate to ask for help when you need it"
            ],
            EmotionType.PROUD: [
                "Take time to fully acknowledge and celebrate your achievement",
                "Share your success with people who supported you along the way",
                "Reflect on the skills and qualities that led to this success",
                "Use this confidence to set your next meaningful goal",
                "Consider how you can help others achieve similar success"
            ]
        }
        
        # NEW: real model pipeline
        # This model classifies text into 6 emotions: 'sadness', 'joy', 'love', 'anger', 'fear', 'surprise'
        self.real_pipeline = pipeline("text-classification", 
                                      model="bhadresh-savani/distilbert-base-uncased-emotion")
        
        logger.info("EmotionAnalyzer initialized successfully")
    
    def analyze_emotion(self, request: EmotionAnalysisRequest) -> EmotionAnalysisResponse:
        """
        Analyzes emotion from text input using either a real ML model or mock logic.
        Updates internal statistics regardless of the analysis method used.
        """
        start_time = time.time()
        analysis_id = str(uuid.uuid4())
        
        logger.info(f"Starting emotion analysis {analysis_id} for text: {request.text[:100]}...")
        
        response: EmotionAnalysisResponse
        try:
            if request.use_real_model:
                response = self._analyze_with_real_model(request, analysis_id, start_time)
            else:
                response = self._analyze_with_mock_logic(request, analysis_id, start_time)
            
            # Update statistics for both real and mock analyses
            self.analysis_count += 1
            # Store emotion value and confidence for stats calculation
            self.emotion_history.append((response.emotion, response.confidence)) 
            self.total_processing_time += response.processing_time
            
            logger.info(f"Analysis {analysis_id} completed: {response.emotion} ({response.confidence:.3f} confidence)")
            return response
            
        except Exception as e:
            logger.error(f"Error in emotion analysis {analysis_id}: {str(e)}")
            raise
            
    def _analyze_with_real_model(self, request: EmotionAnalysisRequest, analysis_id: str, start_time: float) -> EmotionAnalysisResponse:
        """Analyze emotion using the real model"""
        logger.info(f"Running real model for analysis ID {analysis_id}")

        try:
            # The real model might return different labels than EmotionType enum.
            # We'll use the label directly from the model.
            result = self.real_pipeline(request.text)[0]
            emotion_label = result["label"]
            confidence = round(float(result["score"]), 3)

            processing_time = round(time.time() - start_time, 3)

            return EmotionAnalysisResponse(
                emotion=emotion_label,
                confidence=confidence,
                secondary_emotions=[], # Real model typically gives one primary, can be extended
                suggestions=["This is a real ML prediction. Suggestions are generic for now."],
                emotion_intensity="medium", # Real model doesn't directly provide intensity
                timestamp=datetime.now().isoformat(),
                processing_time=processing_time,
                analysis_id=analysis_id
            )
        except Exception as e:
            logger.error(f"Failed to run real model for analysis ID {analysis_id}: {e}")
            raise RuntimeError(f"Real model inference failed: {e}")

    def _analyze_with_mock_logic(self, request: EmotionAnalysisRequest, analysis_id: str, start_time: float) -> EmotionAnalysisResponse:
        """Analyze emotion using the existing mock logic"""
        
        try:
            # Simulate realistic processing time
            processing_delay = random.uniform(0.8, 2.5)
            time.sleep(processing_delay)
            
            # Calculate emotion scores
            emotion_scores = self._calculate_emotion_scores(request.text)
            
            # Determine primary emotion
            if max(emotion_scores.values()) == 0:
                # No keywords matched - use neutral with low confidence
                primary_emotion = EmotionType.NEUTRAL
                confidence = random.uniform(0.3, 0.5)
                secondary_emotions = []
            else:
                # Find emotion with highest score
                primary_emotion = max(emotion_scores, key=emotion_scores.get)
                max_score = emotion_scores[primary_emotion]
                
                # Calculate confidence based on score and text length
                base_confidence = min(0.95, 0.4 + (max_score * 0.15))
                text_length_factor = min(1.0, len(request.text) / 100)  # Longer text = higher confidence
                confidence = min(0.95, base_confidence + (text_length_factor * 0.1))
                
                # Add some randomness to make it more realistic
                confidence += random.uniform(-0.05, 0.05)
                confidence = max(0.3, min(0.95, confidence))
                
                # Get secondary emotions
                secondary_emotions = self._get_secondary_emotions(emotion_scores, primary_emotion)
            
            # Determine emotion intensity
            intensity = self._determine_intensity(request.text, primary_emotion)
            
            # Get suggestions
            suggestions = []
            if request.include_suggestions:
                available_suggestions = self.emotion_suggestions.get(primary_emotion, [])
                num_suggestions = min(4, len(available_suggestions))
                suggestions = random.sample(available_suggestions, num_suggestions)
            
            processing_time = time.time() - start_time
            
            response = EmotionAnalysisResponse(
                emotion=primary_emotion.value,
                confidence=round(confidence, 3),
                secondary_emotions=secondary_emotions,
                suggestions=suggestions,
                emotion_intensity=intensity,
                timestamp=datetime.now().isoformat(),
                processing_time=round(processing_time, 3),
                analysis_id=analysis_id
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error in mock emotion analysis {analysis_id}: {str(e)}")
            raise
    
    def _calculate_emotion_scores(self, text: str) -> Dict[EmotionType, float]:
        """Calculate weighted scores for each emotion based on keywords."""
        text_lower = text.lower()
        emotion_scores = {}
        
        for emotion, keyword_groups in self.emotion_keywords.items():
            score = 0.0
            
            # Primary keywords (highest weight)
            for keyword in keyword_groups.get('primary', []):
                if keyword in text_lower:
                    score += 3.0
            
            # Secondary keywords (medium weight)
            for keyword in keyword_groups.get('secondary', []):
                if keyword in text_lower:
                    score += 2.0
            
            # Contextual keywords (lower weight)
            for keyword in keyword_groups.get('contextual', []):
                if keyword in text_lower:
                    score += 1.0
            
            emotion_scores[emotion] = score
        
        return emotion_scores
    
    def _determine_intensity(self, text: str, emotion: EmotionType) -> str:
        """Determine the intensity level of the emotion based on intensity words."""
        text_lower = text.lower()
        
        # High intensity indicators
        high_intensity_words = [
            'extremely', 'incredibly', 'absolutely', 'completely', 'totally',
            'utterly', 'so much', 'overwhelming', 'intense', 'severe'
        ]
        
        # Low intensity indicators
        low_intensity_words = [
            'slightly', 'somewhat', 'a little', 'kind of', 'sort of',
            'mildly', 'barely', 'hardly', 'just a bit'
        ]
        
        if any(word in text_lower for word in high_intensity_words):
            return "high"
        elif any(word in text_lower for word in low_intensity_words):
            return "low"
        else:
            return "medium"
    
    def _get_secondary_emotions(self, emotion_scores: Dict[EmotionType, float], primary_emotion: EmotionType) -> List[str]:
        """Get secondary emotions based on scores, excluding the primary emotion."""
        # Remove primary emotion and get top 2 secondary emotions
        secondary_scores = {k: v for k, v in emotion_scores.items() if k != primary_emotion and v > 0}
        
        if not secondary_scores:
            return []
        
        # Sort by score and get top 2
        sorted_emotions = sorted(secondary_scores.items(), key=lambda x: x[1], reverse=True)
        return [emotion.value for emotion, _ in sorted_emotions[:2]]
    
    def get_stats(self) -> EmotionStats:
        """Get analysis statistics including total analyses, most common emotion, and average processing time."""
        if not self.emotion_history:
            return EmotionStats(
                total_analyses=0,
                most_common_emotion="None",
                average_confidence=0.0,
                processing_time_avg=0.0
            )
        
        # Extract just the emotion values for counting
        emotion_values = [item[0] for item in self.emotion_history]
        emotion_counter = Counter(emotion_values)
        most_common = emotion_counter.most_common(1)[0][0]

        # Calculate average confidence from stored values
        total_confidence = sum(item[1] for item in self.emotion_history)
        average_confidence = total_confidence / len(self.emotion_history)
        
        return EmotionStats(
            total_analyses=self.analysis_count,
            most_common_emotion=most_common,
            average_confidence=round(average_confidence, 3),
            processing_time_avg=round(self.total_processing_time / self.analysis_count, 3)
        )

# Create singleton instance
emotion_analyzer = EmotionAnalyzer()
